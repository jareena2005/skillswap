import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Recommendations({ token, refreshKey }) {
  const [recommendations, setRecommendations] = useState([]);

  const fetchRecommendations = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/swaps/recommendations/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRecommendations(res.data || []);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setRecommendations([]);
    }
  };

  useEffect(() => {
    if (token) fetchRecommendations();
  }, [token, refreshKey]);

  const handleSendRequest = async (rec) => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/swaps/create/",
        {
          receiver: rec.user_id,
          skill_requested: rec.they_offer, // ✅ THEY give
          skill_offered: rec.they_want     // ✅ YOU give
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchRecommendations();
    } catch (err) {
      console.error(err.response?.data?.error || err.message);
    }
  };
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-2 flex items-center justify-between">
        <span>Smart Recommendations</span>
        <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Matches based on your wants</span>
      </h2>

      {recommendations.length === 0 && (
        <div className="text-sm text-slate-400 py-6 text-center border border-dashed border-slate-200 rounded-xl space-y-3">
          <p>No recommendations yet. Add both teaching and learning skills on the Teach page to see smart swap matches.</p>
          <Link
            to="/teach"
            className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition"
          >
            Go to Teach
          </Link>
        </div>
      )}

      <div className="space-y-3">
        {recommendations.map((rec) => (
          <div
            key={`${rec.user_id}-${rec.they_offer}`}
            className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-slate-50 border border-slate-100 p-4 rounded-xl hover:border-blue-200 hover:bg-blue-50/10 transition-all"
          >
            <div className="text-sm text-slate-600">
              <span className="font-semibold text-blue-600">
                {rec.username}
              </span>{" "}
              can teach you <span className="font-semibold text-slate-800 bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs">{rec.they_offer}</span>
              {rec.they_want ? (
                <span> in exchange for your <span className="font-semibold text-slate-800 bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs">{rec.they_want}</span>.</span>
              ) : (
                <span> — add an offer skill to request a swap.</span>
              )}
            </div>

            <button
              onClick={() => handleSendRequest(rec)}
              disabled={!rec.they_want}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition self-start sm:self-auto shadow-sm ${rec.they_want ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer" : "bg-slate-200 text-slate-500 cursor-not-allowed"}`}
            >
              {rec.they_want ? "Send Swap Request" : "No direct swap available"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

}
