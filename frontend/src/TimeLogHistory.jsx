import React, { useEffect, useState } from "react";
import { userAuth } from "./AuthContext";

const TimeLogHistory = () => {
  const { session } = userAuth();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!session?.user?.id) return;

      try {
        const res = await fetch(`http://localhost:8000/time_logs/history/${session.user.id}`);
        if (!res.ok) throw new Error("Failed to fetch logs");

        const data = await res.json();

        // Mark missing clock-outs
        const updated = data.map((log) => ({
          ...log,
          status: log.clock_out ? "normal" : "missing",
        }));

        setLogs(updated);
      } catch (err) {
        console.error("Error fetching time logs:", err);
      }
    };

    fetchLogs();
  }, [session]);

  const calculateHours = (inTime, outTime) => {
    if (!inTime || !outTime) return "—";
    const start = new Date(inTime);
    const end = new Date(outTime);
    const diffMs = end - start;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow bg-gray-100 p-6 mt-6">
      <table className="min-w-full text-sm text-left text-gray-700 bg-white border border-gray-300 rounded">
        <thead className="bg-blue-500 text-white uppercase text-xs">
          <tr>
            <th className="px-4 py-3 border">Date</th>
            <th className="px-4 py-3 border">Clock In</th>
            <th className="px-4 py-3 border">Clock Out</th>
            <th className="px-4 py-3 border">Status</th>
            <th className="px-4 py-3 border">Total Hours</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => {
            const isMissing = log.status === "missing";

            return (
              <tr
                key={log.id}
                className={`hover:bg-gray-100 ${isMissing ? "bg-red-100 text-red-800" : "even:bg-gray-50"}`}
              >
                <td className="px-4 py-2 border">{log.clock_in?.slice(0, 10)}</td>
                <td className="px-4 py-2 border">{log.clock_in?.slice(11, 16)}</td>
                <td className="px-4 py-2 border">{log.clock_out?.slice(11, 16) || "—"}</td>
                <td className="px-4 py-2 border">
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                    isMissing ? "bg-red-200 text-red-800" : "bg-green-100 text-green-700"
                  }`}>
                    {log.status}
                  </span>
                </td>
                <td className="px-4 py-2 border">
                  {calculateHours(log.clock_in, log.clock_out)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TimeLogHistory;
