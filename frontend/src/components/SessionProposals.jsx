import { useEffect, useState } from "react";
import axios from "axios";

export default function SessionProposals({ token, refreshKey }) {
    const [sessions, setSessions] = useState([]);

    const fetchSessions = async () => {
        try {
            const res = await axios.get(
                "http://127.0.0.1:8000/api/swaps/session/incoming/",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSessions(res.data);
        } catch (err) {
            console.error("Failed to fetch incoming sessions", err);
        }
    };

    useEffect(() => {
        if (token) fetchSessions();
    }, [token, refreshKey]);

    const handleRespond = async (sessionId, action) => {
        try {
            await axios.post(
                `http://127.0.0.1:8000/api/swaps/session/respond/${sessionId}/`,
                { action },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchSessions(); // Refresh list immediately
        } catch (err) {
            console.error(`Failed to ${action} session`, err);
        }
    };

    if (sessions.length === 0) return null;

    return (
        <div>
            <h2 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
                Session Proposals ({sessions.length})
            </h2>
            <div className="space-y-3">
                {sessions.map((s) => (
                    <div
                        key={s.id}
                        className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex justify-between items-center hover:border-blue-200 transition-all"
                    >
                        <div>
                            <p className="text-sm text-slate-800 font-bold border-b border-slate-200/60 pb-1 mb-2">
                                Proposal from {s.proposer}
                            </p>
                            <div className="space-y-1 text-xs text-slate-600">
                                <p>🗓 <span className="font-medium">Date:</span> {s.date}</p>
                               <p>⏰ <span className="font-medium">Time:</span> {s.time}</p>
                                <p>⏱ <span className="font-medium">Duration:</span> {s.duration} mins</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleRespond(s.id, "accept")}
                                className="bg-blue-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 transition cursor-pointer shadow-sm"
                            >
                                Accept
                            </button>
                            <button
                                onClick={() => handleRespond(s.id, "reject")}
                                className="border border-slate-200 text-slate-600 px-3.5 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
