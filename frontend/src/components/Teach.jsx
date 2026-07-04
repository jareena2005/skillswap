import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const categories = [
  { id: "programming", label: "Programming & Tech", emoji: "💻" },
  { id: "design", label: "Design & Creative", emoji: "🎨" },
  { id: "music", label: "Music & Audio", emoji: "🎵" },
  { id: "languages", label: "Languages", emoji: "🌍" },
  { id: "photography", label: "Photography & Video", emoji: "📷" },
  { id: "cooking", label: "Cooking & Baking", emoji: "🍳" },
  { id: "writing", label: "Writing & Content", emoji: "✍️" },
  { id: "fitness", label: "Fitness & Sports", emoji: "💪" },
  { id: "business", label: "Business & Finance", emoji: "📊" },
  { id: "academic", label: "Academic & Tutoring", emoji: "🧠" },
  { id: "arts", label: "Arts & Crafts", emoji: "🎭" },
  { id: "gardening", label: "Gardening & Nature", emoji: "🌱" },
  { id: "diy", label: "DIY & Home Repair", emoji: "🔧" },
  { id: "wellness", label: "Wellness & Mindfulness", emoji: "💆" },
  { id: "gaming", label: "Gaming & Esports", emoji: "🎮" },
  { id: "marketing", label: "Social Media & Marketing", emoji: "📱" },
];

const suggestions = {
  "Programming & Tech": [
    "Python",
    "Django",
    "React",
    "JavaScript",
    "Java",
    "SQL",
    "Machine Learning",
    "OpenCV",
  ],
  "Design & Creative": ["Figma", "Photoshop", "Illustrator", "Canva", "UI/UX", "Logo Design"],
  "Music & Audio": ["Guitar", "Piano", "Violin", "Music Production", "Singing", "Drums"],
  Languages: ["Tamil", "Hindi", "English", "French", "Spanish", "Japanese", "German", "Urdu"],
  "Photography & Video": ["Portrait", "Editing", "Lightroom", "Videography", "YouTube editing"],
  "Cooking & Baking": ["South Indian", "Baking", "Biryani", "Cake Decorating", "Meal Prep"],
  "Writing & Content": ["Blog Writing", "Copywriting", "Resume Writing", "Creative Writing", "Technical Writing"],
  "Fitness & Sports": ["Yoga", "Gym Training", "Zumba", "Cricket", "Badminton", "Football"],
  "Business & Finance": ["Excel", "Accounting", "Public Speaking", "Digital Marketing", "Entrepreneurship"],
  "Academic & Tutoring": ["Maths", "Physics", "Chemistry", "IELTS", "CAT Prep", "Coding for beginners"],
};

const levelOptions = ["beginner", "intermediate", "expert"];
const availabilityOptions = ["weekdays", "weekends", "flexible"];

function formatLabel(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function Teach({ token }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [formError, setFormError] = useState("");

  const [selectedOfferCategory, setSelectedOfferCategory] = useState(categories[0]?.label || null);
  const [selectedWantCategory, setSelectedWantCategory] = useState(categories[1]?.label || categories[0]?.label || null);

  const [offerSkillInput, setOfferSkillInput] = useState("");
  const [wantSkillInput, setWantSkillInput] = useState("");

  const [offerSkills, setOfferSkills] = useState([]);
  const [wantSkills, setWantSkills] = useState([]);

  const [offerExperience, setOfferExperience] = useState("beginner");
  const [wantExperience, setWantExperience] = useState("beginner");
  const [offerAvailability, setOfferAvailability] = useState("flexible");
  const [wantAvailability, setWantAvailability] = useState("flexible");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    setLoading(false);
  }, [token, navigate]);

  const offerSuggestions = useMemo(() => {
    const category = selectedOfferCategory || "Programming & Tech";
    const list = suggestions[category] || [];
    return list.filter((skill) =>
      skill.toLowerCase().includes(offerSkillInput.toLowerCase()) && !offerSkills.some((item) => item.name.toLowerCase() === skill.toLowerCase())
    );
  }, [offerSkillInput, selectedOfferCategory, offerSkills]);

  const wantSuggestions = useMemo(() => {
    const category = selectedWantCategory || "Programming & Tech";
    const list = suggestions[category] || [];
    return list.filter((skill) =>
      skill.toLowerCase().includes(wantSkillInput.toLowerCase()) && !wantSkills.some((item) => item.name.toLowerCase() === skill.toLowerCase())
    );
  }, [wantSkillInput, selectedWantCategory, wantSkills]);

  const handleAddSkill = (section, name) => {
    const normalized = name.trim();
    if (!normalized) return;

    const selectedCategory = section === "offer" ? selectedOfferCategory : selectedWantCategory;
    if (!selectedCategory) {
      setFormError("Please select a category before adding skills.");
      return;
    }

    const setter = section === "offer" ? setOfferSkills : setWantSkills;
    const values = section === "offer" ? offerSkills : wantSkills;
    const experience = section === "offer" ? offerExperience : wantExperience;
    const availability = section === "offer" ? offerAvailability : wantAvailability;

    const exists = values.some((item) => item.name.toLowerCase() === normalized.toLowerCase());
    if (exists) return;

    setter([
      ...values,
      {
        id: `${Date.now()}-${normalized}`,
        name: normalized,
        category: selectedCategory,
        experience_level: experience,
        availability,
      },
    ]);

    if (section === "offer") {
      setOfferSkillInput("");
    } else {
      setWantSkillInput("");
    }
    setFormError("");
  };

  const handleRemoveSkill = (section, id) => {
    const setter = section === "offer" ? setOfferSkills : setWantSkills;
    const values = section === "offer" ? offerSkills : wantSkills;
    setter(values.filter((item) => item.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setMessage(null);

    if (!offerSkills.length || !wantSkills.length) {
      setFormError("Please add at least one skill you can teach and one skill you want to learn.");
      return;
    }

    setSaving(true);
    try {
      await axiosInstance.post(
        "/skills/me/full/",
        {
          offer: offerSkills.map((skill) => ({
            skill_name: skill.name,
            category: skill.category,
            experience_level: skill.experience_level,
            availability: skill.availability,
            description,
          })),
          want: wantSkills.map((skill) => ({
            skill_name: skill.name,
            category: skill.category,
            experience_level: skill.experience_level,
            availability: skill.availability,
            description,
          })),
          description,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage({ type: "success", text: "Skills saved! Redirecting to dashboard..." });
      localStorage.setItem("skillsUpdatedAt", Date.now().toString());
      window.dispatchEvent(new Event("skillsUpdated"));
      setTimeout(() => navigate("/"), 1400);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: err.response?.data?.error || "Unable to save your skills." });
    } finally {
      setSaving(false);
    }
  };

  const sectionClass = "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm";
  const activeAccent = (section) => section === "offer" ? "indigo" : "emerald";
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
          <p className="mt-4 text-slate-500">Preparing your teach experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <div className="bg-white border-b border-slate-200 mb-8">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">What can you offer &amp; what do you want to learn?</h1>
            <p className="mt-2 text-slate-600 max-w-2xl">Select your skills below to find your perfect swap match.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/"
              className="text-sm font-semibold text-slate-600 hover:text-indigo-700 transition"
            >
              Back to dashboard
            </Link>
            <Link
              to="/browse"
              className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-500/10 hover:bg-indigo-700 transition"
            >
              Browse matches
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
        <section className="space-y-8">
          <div className={sectionClass}>
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-slate-900">Skills I Can Teach</h2>
                <p className="text-sm text-slate-500">Choose your strongest teaching categories and list exact skills.</p>
              </div>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700">
                Tap a category
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category) => {
                const selected = selectedOfferCategory === category.label;
                return (
                  <button
                    type="button"
                    key={category.id}
                    onClick={() => setSelectedOfferCategory(category.label)}
                    className={`group rounded-3xl border p-4 text-left transition transform hover:-translate-y-0.5 ${selected ? "border-indigo-500 bg-indigo-600 text-white shadow-lg shadow-indigo-500/10" : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300"}`}
                  >
                    <div className="text-3xl mb-3">{category.emoji}</div>
                    <div className="text-sm font-semibold leading-snug">{category.label}</div>
                  </button>
                );
              })}
            </div>
            <div className="mt-8 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Enter specific skill name</label>
                <div className="flex gap-2">
                  <input
                    value={offerSkillInput}
                    onChange={(e) => setOfferSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSkill("offer", offerSkillInput);
                      }
                    }}
                    placeholder="e.g. Python, Django, React"
                    className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSkill("offer", offerSkillInput)}
                    className="rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
                  >
                    Add
                  </button>
                </div>
                {offerSuggestions.length > 0 && offerSkillInput && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {offerSuggestions.slice(0, 6).map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => handleAddSkill("offer", suggestion)}
                        className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 transition"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="flex flex-wrap gap-3 mb-3">
                  {offerSkills.map((skill) => (
                    <span key={skill.id} className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-3 py-2 text-white text-sm shadow-sm">
                      {skill.name}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill("offer", skill.id)}
                        className="rounded-full bg-white/20 p-1 text-white transition hover:bg-white/30"
                        aria-label={`Remove ${skill.name}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-2">Experience level</p>
                    <div className="grid grid-cols-3 gap-2">
                      {levelOptions.map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setOfferExperience(level)}
                          className={`rounded-2xl border px-3 py-2 text-sm font-medium transition ${offerExperience === level ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300"}`}
                        >
                          {formatLabel(level)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-2">Availability</p>
                    <div className="grid grid-cols-3 gap-2">
                      {availabilityOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setOfferAvailability(option)}
                          className={`rounded-2xl border px-3 py-2 text-sm font-medium transition ${offerAvailability === option ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300"}`}
                        >
                          {formatLabel(option)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={sectionClass}>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 mb-4">Skills I Want to Learn</h2>
            <p className="text-sm text-slate-500 mb-6">Use a separate color and category flow for learning goals.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category) => {
                const selected = selectedWantCategory === category.label;
                return (
                  <button
                    type="button"
                    key={category.id}
                    onClick={() => setSelectedWantCategory(category.label)}
                    className={`group rounded-3xl border p-4 transition transform hover:-translate-y-0.5 ${selected ? "border-emerald-500 bg-emerald-600 text-white shadow-lg shadow-emerald-500/10" : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300"}`}
                  >
                    <div className="text-3xl mb-3">{category.emoji}</div>
                    <div className="text-sm font-semibold leading-snug">{category.label}</div>
                  </button>
                );
              })}
            </div>
            <div className="mt-8 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Enter specific skill name</label>
                <div className="flex gap-2">
                  <input
                    value={wantSkillInput}
                    onChange={(e) => setWantSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSkill("want", wantSkillInput);
                      }
                    }}
                    placeholder="e.g. Figma, Guitar, French"
                    className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSkill("want", wantSkillInput)}
                    className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
                  >
                    Add
                  </button>
                </div>
                {wantSuggestions.length > 0 && wantSkillInput && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {wantSuggestions.slice(0, 6).map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => handleAddSkill("want", suggestion)}
                        className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 transition"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="flex flex-wrap gap-3 mb-3">
                  {wantSkills.map((skill) => (
                    <span key={skill.id} className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-2 text-white text-sm shadow-sm">
                      {skill.name}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill("want", skill.id)}
                        className="rounded-full bg-white/20 p-1 text-white transition hover:bg-white/30"
                        aria-label={`Remove ${skill.name}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-2">Experience level</p>
                    <div className="grid grid-cols-3 gap-2">
                      {levelOptions.map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setWantExperience(level)}
                          className={`rounded-2xl border px-3 py-2 text-sm font-medium transition ${wantExperience === level ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300"}`}
                        >
                          {formatLabel(level)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-2">Availability</p>
                    <div className="grid grid-cols-3 gap-2">
                      {availabilityOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setWantAvailability(option)}
                          className={`rounded-2xl border px-3 py-2 text-sm font-medium transition ${wantAvailability === option ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300"}`}
                        >
                          {formatLabel(option)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={sectionClass}>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 mb-4">Additional Details</h2>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Describe your teaching style or what you're looking for</label>
            <textarea
              value={description}
              onChange={(e) => {
                if (e.target.value.length <= 300) setDescription(e.target.value);
              }}
              placeholder="e.g. I prefer hands-on learning, available on weekends..."
              className="min-h-[130px] w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span>Max 300 characters</span>
              <span>{description.length}/300</span>
            </div>
          </div>

          {formError && (
            <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {formError}
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="w-full rounded-3xl bg-indigo-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? "Saving..." : "Save & Find My Matches →"}
          </button>
          <p className="text-center text-sm text-slate-500">You can update your skills anytime from your profile.</p>
          {message && (
            <div className={`rounded-3xl px-4 py-3 text-sm font-semibold ${message.type === "success" ? "bg-emerald-50 border border-emerald-100 text-emerald-700" : "bg-red-50 border border-red-100 text-red-700"}`}>
              {message.text}
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400 font-bold">Live Preview</p>
                <h3 className="text-xl font-semibold text-slate-900">Your swap profile card</h3>
              </div>
              <div className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 shadow-sm">
                Real-time
              </div>
            </div>
            <div className="rounded-3xl border border-slate-100 bg-gradient-to-br from-indigo-600 via-slate-900 to-slate-800 p-6 text-white shadow-xl">
              <div className="mb-5">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-200/80">Teach & Learn</p>
                <h2 className="mt-3 text-2xl font-bold">{selectedOfferCategory || "Pick a teaching category"}</h2>
                <p className="mt-2 text-sm text-slate-200/90">{selectedWantCategory ? `Looking to learn ${selectedWantCategory}` : "Choose a learning category to complete your card."}</p>
              </div>
              <div className="space-y-4">
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-200/80">You can teach</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {offerSkills.length ? offerSkills.map((skill) => (
                      <span key={skill.id} className="rounded-full bg-white/15 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white/90">{skill.name}</span>
                    )) : (
                      <span className="text-slate-200/70 text-sm">Add skill tags to show what you offer.</span>
                    )}
                  </div>
                </div>
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-200/80">You want to learn</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {wantSkills.length ? wantSkills.map((skill) => (
                      <span key={skill.id} className="rounded-full bg-slate-100/15 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white/90">{skill.name}</span>
                    )) : (
                      <span className="text-slate-200/70 text-sm">Add learning goals to complete your profile.</span>
                    )}
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl bg-white/10 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-200/80">Experience</p>
                    <p className="mt-2 text-sm text-white/90">Teach: {formatLabel(offerExperience)}</p>
                    <p className="mt-1 text-sm text-slate-200/80">Learn: {formatLabel(wantExperience)}</p>
                  </div>
                  <div className="rounded-3xl bg-white/10 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-200/80">Availability</p>
                    <p className="mt-2 text-sm text-white/90">Teach: {formatLabel(offerAvailability)}</p>
                    <p className="mt-1 text-sm text-slate-200/80">Learn: {formatLabel(wantAvailability)}</p>
                  </div>
                </div>
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-200/80">Summary</p>
                  <p className="mt-3 text-sm text-slate-200/80 min-h-[72px]">{description || "Add a short note to explain your teaching style or what you're looking for."}</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
