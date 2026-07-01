import { useEffect, useState } from "react";
import axios from "axios";

export default function Skills({ token, mySkills, setMySkills, refreshKey }) {
  const [offerText, setOfferText] = useState("");
  const [wantText, setWantText] = useState("");
  const [error, setError] = useState("");

  const fetchSkills = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/skills/me/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const newSkills = {
        offer: res.data?.offer || [],
        want: res.data?.want || [],
      };
      
      setMySkills(newSkills); // Update parent state
      return newSkills;
    } catch (err) {
      console.error("Fetch skills failed:", err.response?.data || err.message);
      setMySkills({ offer: [], want: [] });
      return { offer: [], want: [] };
    }
  };

  useEffect(() => {
    if (token) fetchSkills();
  }, [token, refreshKey]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const offer = offerText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const want = wantText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (!offer.length || !want.length) {
      setError("Both offer and want skills are required");
      return;
    }

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/skills/me/",
        { offer, want },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOfferText("");
      setWantText("");
      fetchSkills(); // refresh after success
    } catch (err) {
      console.error("Submit skills error:", err.response?.data || err.message);
      setError("Failed to submit skills!");
    }
  };

  // 🔥 NEW: Delete individual skill
  const deleteSkill = async (skillName, type) => {
    if (!confirm(`Remove ${skillName} from ${type}?`)) return;

    try {
      // Backend DELETE endpoint needed for this
      await axios.delete("http://127.0.0.1:8000/api/skills/me/delete/", {
        data: { skill_name: skillName, type },
        headers: { Authorization: `Bearer ${token}` }
      });
      
      fetchSkills(); // Refresh
    } catch (err) {
      alert("Delete failed - backend endpoint needed");
      console.error(err);
    }
  };

//   return (
//     <div>
//       <h2>Enter Skills You Offer & Want</h2>

//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Skills you offer (comma separated)"
//           value={offerText}
//           onChange={(e) => setOfferText(e.target.value)}
//         />
//         <br />

//         <input
//           type="text"
//           placeholder="Skills you want (comma separated)"
//           value={wantText}
//           onChange={(e) => setWantText(e.target.value)}
//         />
//         <br />

//         <button type="submit">Submit</button>
//       </form>

//       {error && <p style={{ color: "red" }}>{error}</p>}

//       <h3>Your Offered Skills</h3>
//       {mySkills.offer.length > 0 ? (
//         <ul>
//           {mySkills.offer.map((s, i) => (
//             <li key={i}>
//               {s} 
//               <button 
//                 onClick={() => deleteSkill(s, 'offer')}
//                 style={{ marginLeft: '10px', fontSize: '12px' }}
//               >
//                 ❌ Remove
//               </button>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No offered skills yet.</p>
//       )}

//       <h3>Your Wanted Skills</h3>
//       {mySkills.want.length > 0 ? (
//         <ul>
//           {mySkills.want.map((s, i) => (
//             <li key={i}>
//               {s}
//               <button 
//                 onClick={() => deleteSkill(s, 'want')}
//                 style={{ marginLeft: '10px', fontSize: '12px' }}
//               >
//                 ❌ Remove
//               </button>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No wanted skills yet.</p>
//       )}
//     </div>
//   );



return (
  <div>
    <h2 className="text-xl font-bold mb-6 text-slate-800 border-b border-slate-100 pb-2">
      My Skills Profile
    </h2>

    {/* Form */}
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Skills You Offer
        </label>
        <input
          type="text"
          placeholder="e.g. Python, React, Public Speaking"
          value={offerText}
          onChange={(e) => setOfferText(e.target.value)}
          className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 transition-all"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Skills You Want
        </label>
        <input
          type="text"
          placeholder="e.g. UI Design, Django, Machine Learning"
          value={wantText}
          onChange={(e) => setWantText(e.target.value)}
          className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 transition-all"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold text-sm cursor-pointer shadow-sm"
      >
        Add Skills
      </button>

      {error && (
        <p className="text-red-500 text-sm font-medium mt-2">
          {error}
        </p>
      )}
    </form>

    {/* Offered Skills */}
    <div className="mt-8">
      <h3 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wider">
        Skills You Offer
      </h3>

      {mySkills.offer.length === 0 ? (
        <p className="text-sm text-slate-400">No offered skills yet.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {mySkills.offer.map((skill, index) => (
            <span
              key={index}
              className="bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5"
            >
              {skill}
              <button
                type="button"
                onClick={() => deleteSkill(skill, 'offer')}
                className="hover:text-blue-900 font-extrabold text-sm focus:outline-none cursor-pointer"
                title="Remove skill"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}
    </div>

    {/* Wanted Skills */}
    <div className="mt-8">
      <h3 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wider">
        Skills You Want
      </h3>

      {mySkills.want.length === 0 ? (
        <p className="text-sm text-slate-400">No wanted skills yet.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {mySkills.want.map((skill, index) => (
            <span
              key={index}
              className="bg-slate-50 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5"
            >
              {skill}
              <button
                type="button"
                onClick={() => deleteSkill(skill, 'want')}
                className="hover:text-slate-900 font-extrabold text-xs focus:outline-none cursor-pointer"
                title="Remove skill"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  </div>
);
}