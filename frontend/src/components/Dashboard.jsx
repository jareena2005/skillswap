// // Dashboard.js
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom"; 
// import Skills from "./Skills";
// import Recommendations from "./Recommendations";
// import IncomingRequests from "./IncomingRequests";

// export default function Dashboard({ token, onLogout }) {
//   const [mySkills, setMySkills] = useState({ offer: [], want: [] });
//   const [refreshKey, setRefreshKey] = useState(0);
//   const navigate = useNavigate(); // <-- hook for navigation

//   const handleRefreshAll = () => {
//     setRefreshKey(prev => prev + 1);
//   };

//   const goToChatRoom = () => {
//     navigate("/chat"); // <-- navigate to chat page
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">

//       {/* Top Header */}
//       <div className="flex justify-between items-center bg-white p-5 rounded-2xl shadow mb-6">
//         <h1 className="text-2xl font-bold text-indigo-600">
//           SkillSwap Dashboard 
//         </h1>

//         <div className="space-x-3">
//           <button
//             onClick={handleRefreshAll}
//             className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
//           >
//             Refresh
//           </button>

//           <button
//             onClick={goToChatRoom} // <-- new chat button
//             className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
//           >
//             Chat Room
//           </button>

//           <button
//             onClick={onLogout}
//             className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
//           >
//             Logout
//           </button>
//         </div>
//       </div>

//       {/* Content Sections */}
//       <div className="space-y-6">
//         <div className="bg-white p-6 rounded-2xl shadow">
//           <Skills 
//             token={token} 
//             mySkills={mySkills}
//             setMySkills={setMySkills}
//             refreshKey={refreshKey}
//           />
//         </div>

//         <div className="bg-white p-6 rounded-2xl shadow">
//           <Recommendations 
//             token={token} 
//             mySkills={mySkills}
//             refreshKey={refreshKey}
//           />
//         </div>

//         <div className="bg-white p-6 rounded-2xl shadow">
//           <IncomingRequests 
//             token={token} 
//             refreshKey={refreshKey}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Recommendations from "./Recommendations";
import IncomingRequests from "./IncomingRequests";
import MyMatches from "./MyMatches";
import SessionProposals from "./SessionProposals";
import ScheduledSessions from "./ScheduledSessions";

export default function Dashboard({ token, user, onLogout }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [newRecommendations, setNewRecommendations] = useState(false);

  const handleRefreshAll = () => setRefreshKey(prev => prev + 1);

  useEffect(() => {
    // Automatically auto-refresh the dashboard feeds every 5 seconds
    const interval = setInterval(() => {
      handleRefreshAll();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const syncDashboard = () => {
      handleRefreshAll();
      setNewRecommendations(true);
    };
    const handleStorage = (event) => {
      if (event.key === "skillsUpdatedAt") {
        syncDashboard();
      }
    };

    window.addEventListener("skillsUpdated", syncDashboard);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("skillsUpdated", syncDashboard);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(() => {
    if (!newRecommendations) return;
    const timer = setTimeout(() => setNewRecommendations(false), 4000);
    return () => clearTimeout(timer);
  }, [newRecommendations]);

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Navigation Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 mb-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-blue-600 tracking-tight flex items-center gap-1.5">
              SkillSwap <span className="text-lg">🚀</span>
            </h1>
            {user && (
              <p className="text-xs text-slate-500 mt-0.5">
                Welcome, <span className="font-semibold text-slate-700">{user.first_name || user.username}</span> ({user.email})
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {newRecommendations && (
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm shadow-emerald-500/20">
                <span className="h-2.5 w-2.5 rounded-full bg-white animate-pulse"></span>
                New recommendations loaded
              </div>
            )}
            <Link
              to="/teach"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer shadow-sm shadow-emerald-500/10"
            >
              Teach Skills
            </Link>
            <Link
              to="/profile"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer shadow-sm shadow-indigo-500/10"
            >
              My Profile
            </Link>
            <button
              onClick={onLogout}
              className="border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 transition cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Grid Content Layout */}
      <main className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <Recommendations token={token} refreshKey={refreshKey} />
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <IncomingRequests token={token} refreshKey={refreshKey} />
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-8 divide-y divide-slate-100">
          <div>
            <MyMatches token={token} refreshKey={refreshKey} />
          </div>
          <div className="pt-8">
            <SessionProposals token={token} refreshKey={refreshKey} />
          </div>
          <div className="pt-8">
            <ScheduledSessions token={token} refreshKey={refreshKey} />
          </div>
        </div>
      </main>
    </div>
  );
}