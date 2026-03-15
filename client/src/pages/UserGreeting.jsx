import React from "react";

const UserGreeting = () => {
  const userName = localStorage.getItem("UserName") || "Guest";
  const registerNo = localStorage.getItem("RegisterNo") || "N/A";

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login"; // redirect to login
  };

  return (
    <div className="w-full bg-slate-900 text-white flex items-center justify-between px-6 py-3 shadow-md">
      <div>
        <p className="text-sm">
          Welcome, <span className="font-semibold">{userName}</span> | Reg no: <span className="font-semibold">{registerNo}</span>
        </p>
      </div>
      <button
        onClick={handleLogout}
        className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-4 py-1 rounded-md transition"
      >
        Logout
      </button>
    </div>
  );
};

export default UserGreeting;