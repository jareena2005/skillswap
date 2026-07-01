import { useEffect, useState } from "react";
import axios from "axios";

export default function IncomingRequests({ token, refreshKey }) {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/swaps/incoming/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRequests(res.data);
    } catch (err) {
      console.error("Fetch requests failed:", err.response?.data || err.message);
      setRequests([]);
    }
  };

  useEffect(() => {
    if (token) {
      fetchRequests();
    }
  }, [token, refreshKey]); // 🔥 refreshKey triggers re-fetch!

  const respond = async (id, action) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/swaps/respond/${id}/`,
        { action },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err.response?.data || err.message);
      fetchRequests(); // Re-fetch on error
    }
  };
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-2">
        Incoming Swap Requests
      </h2>

      {requests.length === 0 && (
        <p className="text-sm text-slate-400 py-4 text-center border border-dashed border-slate-200 rounded-xl">
          No incoming swap requests at the moment.
        </p>
      )}

      <div className="space-y-3">
        {requests.map((r) => (
          <div
            key={r.id}
            className="bg-slate-50 border border-slate-100 p-4 rounded-xl hover:border-blue-200 transition-all"
          >
            <p className="text-sm text-slate-600 mb-3">
              <span className="font-semibold text-blue-600">
                {r.requester}
              </span>{" "}
              proposes to teach you <span className="font-semibold text-slate-800 bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs">{r.skill_offered}</span> in exchange for your <span className="font-semibold text-slate-800 bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs">{r.skill_requested}</span>.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => respond(r.id, "accept")}
                className="bg-blue-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 transition cursor-pointer shadow-sm"
              >
                Accept Swap
              </button>

              <button
                onClick={() => respond(r.id, "reject")}
                className="border border-slate-200 text-slate-600 px-3.5 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
              >
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );


}