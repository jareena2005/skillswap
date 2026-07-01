import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function MyMatches({ token, refreshKey }) {
    const [matches, setMatches] = useState([]);
    const [proposingFor, setProposingFor] = useState(null);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [duration, setDuration] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const fetchMatches = async () => {
        try {
            const res = await axios.get(
                "http://127.0.0.1:8000/api/swaps/accepted/",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setMatches(res.data);
        } catch (err) {
            console.error("Fetch matches failed:", err.response?.data || err.message);
            setMatches([]);
        }
    };

    useEffect(() => {
        if (token) {
            fetchMatches();
        }
    }, [token, refreshKey]);

    const handlePropose = async (swapId) => {
        setMessage("");
        try {
            await axios.post(
                "http://127.0.0.1:8000/api/swaps/session/propose/",
                { swap_id: swapId, date, time, duration },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage("Session proposed successfully!");
            setProposingFor(null);
            setDate("");
            setTime("");
            setDuration("");
        } catch (err) {
            setMessage(err.response?.data?.error || "Failed to propose session.");
        }
    };

    return (
        <div>
            <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-2">
                Active Matches & Connections
            </h2>

            {message && <p className="mb-4 text-sm text-blue-600 font-semibold bg-blue-50/50 p-2.5 rounded-lg border border-blue-100">{message}</p>}

            {matches.length === 0 && (
                <p className="text-sm text-slate-400 py-4 text-center border border-dashed border-slate-200 rounded-xl">
                    No active matches yet. Your accepted requests will show up here!
                </p>
            )}

            <div className="space-y-3">
                {matches.map((m) => (
                    <div
                        key={m.id}
                        className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex flex-col gap-3.5 hover:border-blue-200 transition-all"
                    >
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                            <div>
                                <p className="text-sm text-slate-700">
                                    You matched with{" "}
                                    <span className="font-semibold text-blue-600">
                                        {m.other_user}
                                    </span>
                                </p>
                                <p className="text-xs text-slate-500 mt-1 flex flex-wrap gap-1.5 items-center">
                                    <span>You give:</span>
                                    <span className="font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">{m.skill_i_give}</span>
                                    <span className="text-slate-300">|</span>
                                    <span>You get:</span>
                                    <span className="font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">{m.skill_i_get}</span>
                                </p>
                            </div>

                            <div className="flex gap-2 self-start sm:self-auto">
                                <button
                                    onClick={() => setProposingFor(proposingFor === m.id ? null : m.id)}
                                    className="border border-blue-600 text-blue-600 px-3.5 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-50 transition cursor-pointer"
                                >
                                    {proposingFor === m.id ? "Cancel" : "Schedule Session"}
                                </button>
                                <button
                                    onClick={() => navigate(`/chat/${m.id}`, { state: { myUsername: m.my_username, otherUser: m.other_user } })}
                                    className="bg-blue-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 transition cursor-pointer shadow-sm"
                                >
                                    Chat Room
                                </button>
                            </div>
                        </div>

                        {proposingFor === m.id && (
                            <div className="mt-2 p-4 bg-white rounded-lg border border-slate-200 flex flex-col sm:flex-row gap-3.5 items-center">
                                <div className="w-full sm:w-auto flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    <div className="flex flex-col">
                                        <label className="text-[10px] uppercase font-bold text-slate-400 mb-1">Date</label>
                                        <input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="border border-slate-200 rounded p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-800"
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-[10px] uppercase font-bold text-slate-400 mb-1">Time</label>
                                        <input
                                            type="time"
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                            className="border border-slate-200 rounded p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-800"
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-[10px] uppercase font-bold text-slate-400 mb-1">Duration</label>
                                        <input
                                            type="number"
                                            placeholder="Duration (mins)"
                                            value={duration}
                                            onChange={(e) => setDuration(e.target.value)}
                                            className="border border-slate-200 rounded p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-800"
                                            required
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={() => handlePropose(m.id)}
                                    disabled={!date || !time || !duration}
                                    className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 disabled:opacity-50 transition cursor-pointer shadow-sm self-end"
                                >
                                    Propose
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
