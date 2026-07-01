import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Profile({ token, onLogout }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Profile Form States
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    bio: "",
    location: "",
    availability: "flexible",
    profile_photo: null
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" }); // type: "success" or "error"
  const [teachSkills, setTeachSkills] = useState({ offer: [], want: [] });
  const [skillsLoading, setSkillsLoading] = useState(true);

  const formatLabel = (value) => value ? value.charAt(0).toUpperCase() + value.slice(1) : "";

  // Fetch profile on mount
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/users/profile/", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = response.data;
        setProfile({
          username: data.username,
          email: data.email,
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          bio: data.bio || "",
          location: data.location || "",
          availability: data.availability || "flexible",
          profile_photo: data.profile_photo // Server URL
        });
        if (data.profile_photo) {
          setPhotoPreview(data.profile_photo);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        if (err.response?.status === 401) {
          onLogout();
        } else {
          setMessage({ text: "Failed to load profile details.", type: "error" });
        }
        setLoading(false);
      }
    };

    const fetchTeachSkills = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/skills/me/full/", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTeachSkills({
          offer: response.data.offer || [],
          want: response.data.want || []
        });
      } catch (err) {
        console.error("Error fetching teach skills:", err);
        setTeachSkills({ offer: [], want: [] });
      } finally {
        setSkillsLoading(false);
      }
    };

    fetchProfile();
    fetchTeachSkills();
  }, [token, navigate, onLogout]);

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle photo trigger click
  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  // Handle Photo File Selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (e.g. 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ text: "File size exceeds 5MB limit.", type: "error" });
        return;
      }
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setMessage({ text: "Only image files are allowed.", type: "error" });
        return;
      }
      setProfile((prev) => ({
        ...prev,
        profile_photo: file
      }));
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const getSkillName = (item) => item.skill?.name || item.skill_name || "Unknown Skill";
  const getSkillCategory = (item) => item.skill?.category || item.category || "General";

  const renderSkillList = (skills) => {
    if (skillsLoading) {
      return (
        <div className="text-sm text-slate-500">Loading teach skills...</div>
      );
    }

    if (!skills.length) {
      return (
        <div className="text-sm text-slate-500">No skills added yet. Add skills on the Teach page to populate this section.</div>
      );
    }

    return (
      <div className="space-y-3">
        {skills.map((skill) => (
          <div key={skill.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-900">{getSkillName(skill)}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500 mt-1">{getSkillCategory(skill)}</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-700">
                  {formatLabel(skill.experience_level)}
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700">
                  {formatLabel(skill.availability)}
                </span>
              </div>
            </div>
            {skill.description ? (
              <p className="mt-3 text-sm text-slate-600">{skill.description}</p>
            ) : null}
          </div>
        ))}
      </div>
    );
  };

  // Handle Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: "", type: "" });

    // Use FormData for file uploads
    const formData = new FormData();
    formData.append("first_name", profile.first_name);
    formData.append("last_name", profile.last_name);
    formData.append("bio", profile.bio);
    formData.append("location", profile.location);
    formData.append("availability", profile.availability);

    // Only append profile photo if it is a File object (meaning a new file was chosen)
    if (profile.profile_photo instanceof File) {
      formData.append("profile_photo", profile.profile_photo);
    }

    try {
      const response = await axios.put("http://127.0.0.1:8000/api/users/profile/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      setMessage({ text: "Profile updated successfully!", type: "success" });
      
      // Update local storage user details if they exist
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        const updatedUser = {
          ...parsed,
          first_name: response.data.first_name,
          last_name: response.data.last_name
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      setMessage({ text: err.response?.data?.detail || "Failed to update profile.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-semibold text-sm">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Breadcrumb */}
        <div className="mb-6 flex justify-between items-center">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition"
          >
            <span>&larr;</span>
            <span>Back to Dashboard</span>
          </Link>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Profile Settings
          </span>
        </div>

        {/* Profile Grid Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-100/50 overflow-hidden grid md:grid-cols-12">
          {/* Left Column - Avatar & Info Summary (4 cols) */}
          <div className="md:col-span-4 bg-slate-50 border-r border-slate-200 p-8 flex flex-col items-center text-center">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Profile Photo</h3>
            
            {/* Avatar Uploader Wrapper */}
            <div className="relative group cursor-pointer" onClick={handlePhotoClick}>
              <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-lg bg-indigo-100 flex items-center justify-center relative">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Profile Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-black text-indigo-700 select-none">
                    {profile.first_name ? profile.first_name[0].toUpperCase() : profile.username[0].toUpperCase()}
                  </span>
                )}
                {/* Upload Hover Overlay */}
                <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              {/* Floating Camera Icon */}
              <div className="absolute bottom-1.5 right-1.5 bg-indigo-600 border-2 border-white rounded-full p-2 text-white shadow shadow-indigo-600/20 group-hover:scale-110 transition">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
              </div>
            </div>

            {/* Hidden Input File */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {/* Username & Email */}
            <h2 className="text-xl font-bold text-slate-800 mt-6 leading-none">
              {profile.first_name || profile.last_name ? `${profile.first_name} ${profile.last_name}` : profile.username}
            </h2>
            <p className="text-sm text-slate-500 font-medium mt-2">{profile.email}</p>
            <p className="text-xs text-indigo-600 font-bold bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1 mt-4 inline-block">
              @{profile.username}
            </p>
            
            {/* Meta statistics or guidelines */}
            <div className="border-t border-slate-200 mt-8 pt-6 w-full text-left space-y-3">
              <div>
                <h5 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Format Tips</h5>
                <p className="text-[11px] text-slate-500 leading-normal mt-1">
                  Upload square PNG or JPG formats. Maximum size 5MB.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Input Details Form (8 cols) */}
          <div className="md:col-span-8 p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Profile Details</h2>

            {/* Alerts */}
            {message.text && (
              <div
                className={`p-4 rounded-xl border mb-6 text-sm font-semibold flex items-center gap-2 ${
                  message.type === "success"
                    ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                    : "bg-red-50 border-red-100 text-red-700"
                }`}
              >
                {message.type === "success" ? (
                  <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                <span>{message.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Names row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={profile.first_name}
                    onChange={handleInputChange}
                    placeholder="e.g. Juliet"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-800 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={profile.last_name}
                    onChange={handleInputChange}
                    placeholder="e.g. Smith"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-800 text-sm font-medium"
                  />
                </div>
              </div>

              {/* Location & Availability Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={profile.location}
                    onChange={handleInputChange}
                    placeholder="e.g. Chennai"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-800 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Availability</label>
                  <select
                    name="availability"
                    value={profile.availability}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-800 text-sm font-semibold bg-white"
                  >
                    <option value="weekdays">Weekdays</option>
                    <option value="weekends">Weekends</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
              </div>

              {/* Bio Field (Optional) */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Bio <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Tell the community about yourself, your goals, and what you'd like to teach or learn..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-800 text-sm font-medium resize-none leading-relaxed"
                ></textarea>
              </div>

              {/* Save Button */}
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto min-w-[140px] bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-lg transition-all duration-200 shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Teach Skills Summary */}
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Provides</h3>
                <p className="text-sm text-slate-500">Skills you can teach from the Teach page.</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                {teachSkills.offer.length} listed
              </span>
            </div>
            {renderSkillList(teachSkills.offer)}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Needed</h3>
                <p className="text-sm text-slate-500">Skills you want to learn from the Teach page.</p>
              </div>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700">
                {teachSkills.want.length} listed
              </span>
            </div>
            {renderSkillList(teachSkills.want)}
          </div>
        </div>
      </div>
    </div>
  );
}
