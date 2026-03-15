import { useState } from "react";

const LoginPage = () => {
  const [registerNo, setRegisterNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Only valid if exactly 12 digits
  const isValidRegisterNo = (value) => /^\d{12}$/.test(value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isValidRegisterNo(registerNo)) {
      setError("Register number must be exactly 12 digits (numbers only)");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ registerNo }),
      });

      const data = await res.json();

      if (data.condition === "SUCCESS") {
        // store token
        localStorage.setItem("Token", data.data.token);
        localStorage.setItem("UserName", data.data.userName);
        localStorage.setItem('RegisterNo', data.data.registerNo);

        // alert("Login successful!");
        // console.log(data.data);
        window.location.href = "/";
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="bg-slate-900 p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-white mb-6">
          Student Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 block mb-1">
              Register Number
            </label>

            <input
              type="text"
              value={registerNo}
              onChange={(e) => {
                // Optional: allow only digits while typing
                const digitsOnly = e.target.value.replace(/\D/g, "");
                setRegisterNo(digitsOnly);
              }}
              maxLength={12}
              placeholder="Enter 12 digit register number"
              className="w-full px-3 py-2 rounded-md bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold py-2 rounded-md transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;