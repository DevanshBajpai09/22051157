require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const TEST_SERVER = "http://20.244.56.144/evaluation-service";
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
let authToken = process.env.AUTH_TOKEN;


const getAuthToken = async () => {
  try {
    const response = await axios.post(`${TEST_SERVER}/auth`, {
      email: "devanshbajpai07@gmail.com",
      name: "Devansh Bajpai",
      rollNo: "22051157",
      accessCode: "nwpwrZ",
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
    });
    authToken = response.data.access_token;
    console.log("Token retrieved:", authToken);
  } catch (error) {
    console.error("Error fetching token:", error.response?.data || error.message);
  }
};


app.get("/users", async (req, res) => {
  try {
    const response = await axios.get(`${TEST_SERVER}/users`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const users = Object.entries(response.data.users).map(([id, name]) => ({ id, name }));

    const userPostCounts = await Promise.all(
      users.map(async (user) => {
        const posts = await axios.get(`${TEST_SERVER}/users/${user.id}/posts`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        return { ...user, postCount: posts.data.posts.length };
      })
    );

    const topUsers = userPostCounts.sort((a, b) => b.postCount - a.postCount).slice(0, 5);
    res.json(topUsers);
  } catch (error) {
    console.error("Error in /users:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});


app.get("/users/:userId/posts", async (req, res) => {
  const { userId } = req.params;
  try {
    const response = await axios.get(`${TEST_SERVER}/users/${userId}/posts`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    res.json(response.data.posts);
  } catch (error) {
    console.error(`Error fetching posts for user ${userId}:`, error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch user posts" });
  }
});


app.get("/posts", async (req, res) => {
  const { type = "latest" } = req.query;
  try {
    const { data } = await axios.get(`${TEST_SERVER}/users`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const users = Object.keys(data.users);

    let allPosts = [];
    for (const userId of users) {
      const posts = await axios.get(`${TEST_SERVER}/users/${userId}/posts`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      allPosts.push(...posts.data.posts.map(post => ({ ...post, userId }))); // Include userId in each post
    }

    if (type === "popular") {
      const postCommentCounts = await Promise.all(
        allPosts.map(async (post) => {
          const comments = await axios.get(`${TEST_SERVER}/posts/${post.id}/comments`, {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          return { ...post, commentCount: comments.data.comments.length };
        })
      );
      allPosts = postCommentCounts.sort((a, b) => b.commentCount - a.commentCount);
    } else {
      allPosts = allPosts.sort((a, b) => b.id - a.id);
    }

    res.json(allPosts.slice(0, 10)); 
  } catch (error) {
    console.error("Error in /posts:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});


app.get("/posts/:postId/comments", async (req, res) => {
  const { postId } = req.params;
  try {
    const response = await axios.get(`${TEST_SERVER}/posts/${postId}/comments`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    res.json(response.data.comments);
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});


app.post("/calculate-average", (req, res) => {
  const { numbers } = req.body;
  if (!Array.isArray(numbers)) {
    return res.status(400).json({ error: "Input must be an array of numbers" });
  }
  const average = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
  res.json({ average });
});

app.listen(5000, async () => {
  await getAuthToken();
  console.log("Server running on http://localhost:5000");
});