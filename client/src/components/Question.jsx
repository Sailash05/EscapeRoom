import { useState } from "react";
import { questions } from "../constants/constants";

const Question = ({ questionNo, handleSubmit }) => {
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const currentQuestion = questions.find((q) => q.questionNo === questionNo);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!answer.trim()) {
      setError("Please enter your answer");
      return;
    }

    try {
      setLoading(true);

      if (handleSubmit) {
        // Call parent-provided function
        await handleSubmit(currentQuestion.questionNo, answer);
        setAnswer(""); // clear input after submit
      }
    } catch (err) {
      setError("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (!currentQuestion) return <p>Question not found</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-slate-900 rounded-xl shadow-lg text-white">
      <h2 className="text-xl font-bold mb-4">
        Question {currentQuestion.questionNo}
      </h2>

      <pre className="whitespace-pre-wrap text-gray-200 mb-6">
        {currentQuestion.question}
      </pre>

      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Enter your answer"
          className="w-full px-3 py-2 rounded-md bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold py-2 rounded-md transition"
        >
          {loading ? "Checking..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Question;