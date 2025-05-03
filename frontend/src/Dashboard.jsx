import React, { useEffect, useState } from "react";
import { userAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import TimeLogHistory from "./TimeLogHistory";
import { LogOut, User, Download } from "lucide-react";

const Dashboard = () => {
  const { session, signOut } = userAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!session?.user?.id) return;

      try {
        const res = await fetch(`http://localhost:8000/users/${session.user.id}`);
        if (!res.ok) throw new Error("Failed to fetch user info");

        const data = await res.json();
        setFullName(data.full_name);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserInfo();
  }, [session]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const downloadCSV = () => {
    const headers = ["Date", "Clock In", "Clock Out", "Status"];
    const rows = [
      ["2024-04-20", "09:00", "17:00", "normal"],
      ["2024-04-19", "08:45", "16:30", "normal"]
    ]; // 🔸 Replace with dynamic logs later

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "time_logs.csv";
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-5xl text-pink-600 font-bold underline bg-yellow-200 p-6 rounded mb-4 text-center">
          Dashboard
        </h1>

        <p className="text-gray-600 mb-4 text-center">
          Welcome,{" "}
          <span className="font-semibold text-blue-600">
            {fullName || session?.user?.email}
          </span>
        </p>

        <div className="flex justify-center gap-4 mb-6 flex-wrap">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow-sm transition"
          >
            <LogOut size={16} /> Sign Out
          </button>
          <button
            onClick={() => alert("Edit Profile coming soon!")}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm transition"
          >
            <User size={16} /> Edit Profile
          </button>
          <button
            onClick={downloadCSV}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-sm transition"
          >
            <Download size={16} /> Download CSV
          </button>
        </div>

        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Time Log History</h2>
        <TimeLogHistory />
      </div>
    </div>
  );
};

export default Dashboard;
