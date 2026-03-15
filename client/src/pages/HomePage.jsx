import { useState, useEffect } from "react";
import Question from "../components/Question";
import UserGreeting from "./UserGreeting";
import { questions } from "../constants/constants";

const HomePage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const fetchSolvedQuestions = async () => {
      try {
        const token = localStorage.getItem("Token");

        if (!token) {
          setMessage("You must be logged in");
          setLoadingProgress(false);
          return;
        }

        const res = await fetch("http://localhost:5000/api/solved", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (data.condition === "SUCCESS" && data.data.userDetails) {
          const solved = data.data.userDetails.questionsSolved || 0;

          if (solved >= questions.length) {
            setCompleted(true);
          } else {
            setCurrentIndex(solved);
          }
        } else {
          setMessage(data.message || "Failed to load progress");
        }
      } catch (err) {
        setMessage("Server error. Try again later.");
      } finally {
        setLoadingProgress(false);
      }
    };

    fetchSolvedQuestions();
  }, []);

  const handleSubmit = async (questionNo, answer) => {
    setMessage("");

    try {
      const token = localStorage.getItem("Token");

      if (!token) {
        setMessage("You must be logged in");
        return { success: false };
      }

      const res = await fetch("http://localhost:5000/api/submit-ans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ questionNo, answer }),
      });

      const data = await res.json();

      if (data.condition === "SUCCESS") {
        setMessage("✅ Correct Answer!");

        if (currentIndex < questions.length - 1) {
          setTimeout(() => {
            setCurrentIndex(currentIndex + 1);
            setMessage("");
          }, 1000);
        } else {
          setTimeout(() => {
            setCompleted(true);
            setMessage("");
          }, 1000);
        }

        return { success: true };
      } else {
        setMessage("❌ " + (data.message || "Wrong answer"));

        setTimeout(() => {
          setMessage("");
        }, 2000);

        return { success: false };
      }
    } catch (err) {
      setMessage("Server error. Try again later.");
      return { success: false };
    }
  };

  if (loadingProgress) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-slate-950">
        Loading your progress...
      </div>
    );
  }

  return (
    <div>
      <UserGreeting />

      <div className="max-w-xl mx-auto mt-6">

        {completed ? (
          <div className="text-center text-white bg-slate-900 p-6 rounded-lg">
            <h1 className="text-3xl font-bold mb-3">🎉 Congratulations!</h1>
            <p className="text-lg">You have completed all the questions.</p>
          </div>
        ) : (
          <>
            <Question
              questionNo={questions[currentIndex].questionNo}
              handleSubmit={handleSubmit}
            />

            {message && (
              <p className="text-center mt-4 text-lg text-white bg-slate-800 p-2 rounded-md">
                {message}
              </p>
            )}
          </>
        )}

      </div>
    </div>
  );
};

export default HomePage;