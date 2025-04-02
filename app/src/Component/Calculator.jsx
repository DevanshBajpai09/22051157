import { useState } from "react";
import { FiPlus, FiTrash2, FiRefreshCw } from "react-icons/fi";

const Calculator = () => {
  const [numbers, setNumbers] = useState([10, 20, 30]);
  const [inputValue, setInputValue] = useState("");
  const [average, setAverage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculateAverage = async () => {
    if (numbers.length === 0) {
      setError("Add at least one number");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/calculate-average", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numbers }),
      });

      if (!response.ok) throw new Error("Failed to calculate");

      const data = await response.json();
      setAverage(data.average);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addNumber = () => {
    if (!inputValue || isNaN(Number(inputValue))) return;
    setNumbers([...numbers, Number(inputValue)]);
    setInputValue("");
  };

  const removeNumber = (index) => {
    setNumbers(numbers.filter((_, i) => i !== index));
  };

  const resetCalculator = () => {
    setNumbers([]);
    setAverage(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h1 className="text-xl font-bold text-center text-gray-800 mb-4">
          Engagement Score Calculator
        </h1>

        
        <div className="flex mb-3">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter a number"
            className="flex-1 px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addNumber}
            className="bg-blue-600 text-white px-3 py-2 rounded-r-lg hover:bg-blue-700 transition"
          >
            <FiPlus />
          </button>
        </div>

        
        <div className="mb-4 max-h-32 overflow-y-auto">
          {numbers.length === 0 ? (
            <p className="text-gray-500 text-center py-1">No numbers added</p>
          ) : (
            <ul className="space-y-1">
              {numbers.map((num, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded-lg"
                >
                  <span className="text-gray-700 text-sm">{num}</span>
                  <button
                    onClick={() => removeNumber(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiTrash2 />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        
        <div className="flex space-x-2 mb-4">
          <button
            onClick={calculateAverage}
            disabled={loading || numbers.length === 0}
            className={`flex-1 py-2 rounded-lg font-medium text-sm ${
              loading || numbers.length === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <FiRefreshCw className="animate-spin mr-1" /> Calculating...
              </span>
            ) : (
              "Calculate Average"
            )}
          </button>
          <button
            onClick={resetCalculator}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-3 rounded-lg font-medium text-sm"
          >
            Reset
          </button>
        </div>

        {/* Result/Error */}
        {error && (
          <div className="bg-red-50 text-red-600 p-2 rounded-lg mb-3 text-sm">
            {error}
          </div>
        )}
        {average !== null && (
          <div className="bg-blue-50 text-blue-600 p-3 rounded-lg text-center text-sm">
            <p className="font-semibold">
              Average: <span className="text-lg">{average.toFixed(2)}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calculator;