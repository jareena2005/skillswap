import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function ScheduledSessions({ token, refreshKey }) {
    const [sessions, setSessions] = useState([]);
    const [ratingFor, setRatingFor] = useState(null);
    const [rating, setRating] = useState(5);
    const [review, setReview] = useState("");

    const fetchScheduled = async () => {
        try {
            const res = await axiosInstance.get(
                "/swaps/session/scheduled/",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSessions(res.data);
        } catch (err) {
            console.error("Failed to fetch scheduled sessions", err);
        }
    };

    useEffect(() => {
        if (token) fetchScheduled();
    }, [token, refreshKey]);

    const handleComplete = async (sessionId) => {
        try {
            await axiosInstance.post(
                `/swaps/session/complete/${sessionId}/`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchScheduled();
        } catch (err) {
            console.error("Failed to mark complete", err);
        }
    };

    const handleSubmitRating = async (sessionId) => {
        try {
            await axiosInstance.post(
                `/swaps/session/rate/${sessionId}/`,
                { rating, review },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setRatingFor(null);
            setReview("");
            fetchScheduled();
        } catch (err) {
            console.error("Rating failed", err.response?.data);
        }
    };

    if (sessions.length === 0) return null;

    return (
        <div>
            <h2 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
                Scheduled Sessions
            </h2>

            <div className="space-y-3">
                {sessions.map((s) => (
                    <div
                        key={s.id}
                        className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex flex-col gap-3.5 hover:border-blue-200 transition-all"
                    >
                        <div>
                            <p className="text-sm text-slate-850 font-bold border-b border-slate-200/60 pb-1 mb-2">
                                Session with {s.other_user}
                            </p>
                            <div className="space-y-1 text-xs text-slate-600">
                                <p>🗓 <span className="font-medium">Date:</span> {s.date}</p>
                                <p>⏰ <span className="font-medium">Time:</span> {s.time}</p>
                                <p>⏱ <span className="font-medium">Duration:</span> {s.duration} mins</p>
                            </div>
                        </div>

                        {/* Show button only if scheduled */}
                        {s.status === "scheduled" && (
                            <button
                                onClick={() => handleComplete(s.id)}
                                className="bg-blue-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 transition cursor-pointer shadow-sm self-start"
                            >
                                Mark as Completed
                            </button>
                        )}

                        {/* Show rating only if completed */}
                        {s.status === "completed" && !s.has_rated && (
                            <>
                                <button
                                    onClick={() =>
                                        setRatingFor(ratingFor === s.id ? null : s.id)
                                    }
                                    className="border border-blue-600 text-blue-600 px-3.5 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-50 transition cursor-pointer self-start"
                                >
                                    Give Rating ⭐
                                </button>

                                {ratingFor === s.id && (
                                    <div className="mt-2 p-3 bg-white border border-slate-200 rounded-lg space-y-3 flex flex-col">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] uppercase font-bold text-slate-400">Rating (1-5)</label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="5"
                                                value={rating}
                                                onChange={(e) =>
                                                    setRating(e.target.value)
                                                }
                                                className="border border-slate-200 rounded p-2 text-xs w-20 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-800"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] uppercase font-bold text-slate-400">Review</label>
                                            <textarea
                                                placeholder="Write review..."
                                                value={review}
                                                onChange={(e) =>
                                                    setReview(e.target.value)
                                                }
                                                className="border border-slate-200 rounded p-2 text-xs w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-800 h-20"
                                            />
                                        </div>

                                        <button
                                            onClick={() =>
                                                handleSubmitRating(s.id)
                                            }
                                            className="bg-blue-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 transition cursor-pointer shadow-sm self-start"
                                        >
                                            Submit Rating
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}