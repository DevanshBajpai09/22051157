import { useEffect, useState } from "react";
import axios from "axios";
import { FiMessageSquare, FiUser, FiArrowUp, FiClock, FiChevronDown } from "react-icons/fi";

const TrendingPost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("latest");
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [comments, setComments] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/posts?type=${filter}`);
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [filter]);

  const fetchComments = async (postId) => {
    if (comments[postId]) return;
    try {
      const response = await axios.get(`http://localhost:5000/posts/${postId}/comments`);
      setComments((prev) => ({ ...prev, [postId]: response.data }));
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error);
    }
  };

  const toggleComments = (postId) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
    } else {
      setExpandedPostId(postId);
      fetchComments(postId);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            {filter === "latest" ? "Latest Posts" : "Popular Posts"}
          </h1>
          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={() => setFilter("latest")}
              className={`px-4 py-2 rounded-full font-medium ${
                filter === "latest" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              <FiClock className="inline mr-2" />
              Latest
            </button>
            <button
              onClick={() => setFilter("popular")}
              className={`px-4 py-2 rounded-full font-medium ${
                filter === "popular" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              <FiArrowUp className="inline mr-2" />
              Popular
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <FiUser size={18} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">User {post.userId}</h3>
                    <p className="mt-1 text-gray-600">{post.content}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <FiMessageSquare className="mr-1" />
                        <span>{post.commentCount || 0} comments</span>
                      </div>
                      <button
                        onClick={() => toggleComments(post.id)}
                        className="flex items-center text-blue-600 text-sm"
                      >
                        {expandedPostId === post.id ? "Hide" : "View"} comments
                        <FiChevronDown
                          className={`ml-1 transition-transform ${expandedPostId === post.id ? "rotate-180" : ""}`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {expandedPostId === post.id && (
                  <div className="mt-4 pl-14 border-t pt-4">
                    {comments[post.id]?.length > 0 ? (
                      <ul className="space-y-3">
                        {comments[post.id].map((comment) => (
                          <li key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-gray-800">{comment.content}</p>
                            <p className="text-xs text-gray-500 mt-1">Comment ID: {comment.id}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 italic">No comments yet.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingPost;
