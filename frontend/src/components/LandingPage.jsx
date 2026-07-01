import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // SVG Icons
  const Icons = {
    Code: () => (
      <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    Design: () => (
      <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    Music: () => (
      <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
    Language: () => (
      <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 11.37 7.363 16 3 16" />
      </svg>
    ),
    Cooking: () => (
      <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    Photography: () => (
      <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    Profile: () => (
      <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    Match: () => (
      <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    Swap: () => (
      <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    SmartMatch: () => (
      <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    Chat: () => (
      <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    Star: () => (
      <svg className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ),
    Shield: () => (
      <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  };

  const categories = [
    { name: "Coding & Dev", icon: Icons.Code, count: "250+ active offers", color: "from-blue-500/10 to-indigo-500/10" },
    { name: "UI/UX & Design", icon: Icons.Design, count: "180+ active offers", color: "from-purple-500/10 to-pink-500/10" },
    { name: "Music & Instruments", icon: Icons.Music, count: "90+ active offers", color: "from-emerald-500/10 to-teal-500/10" },
    { name: "Languages & Linguistics", icon: Icons.Language, count: "140+ active offers", color: "from-orange-500/10 to-amber-500/10" },
    { name: "Culinary & Cooking", icon: Icons.Cooking, count: "110+ active offers", color: "from-red-500/10 to-rose-500/10" },
    { name: "Photography & Video", icon: Icons.Photography, count: "95+ active offers", color: "from-cyan-500/10 to-sky-500/10" }
  ];

  const features = [
    {
      title: "Smart Matching",
      description: "Our intelligent matching assistant connects you with users who want what you teach, and teach what you want.",
      icon: Icons.SmartMatch
    },
    {
      title: "Real-time Chat",
      description: "Send messages, arrange schedules, and coordinate swap sessions seamlessly using our fully integrated chat interface.",
      icon: Icons.Chat
    },
    {
      title: "Peer Reviews",
      description: "Build trusted learning relationships by reviewing your matches and rating swap sessions after completion.",
      icon: Icons.Star
    },
    {
      title: "100% Free Forever",
      description: "No hidden credits, no membership limits, and no transaction fees. A community powered entirely by goodwill.",
      icon: Icons.Shield
    }
  ];

  const testimonials = [
    {
      name: "David Chen",
      role: "Software Dev / Guitarist",
      content: "I taught Python programming to a music graduate, and in return, he taught me classical guitar theory. We met once a week for 2 months. Absolutely amazing experience!",
      initials: "DC",
      bg: "bg-indigo-600"
    },
    {
      name: "Sophia Martinez",
      role: "French Teacher / UX Enthusiast",
      content: "As a French teacher looking to transition into digital design, SkillSwap was a lifesaver. I got structured portfolio feedback while helping my designer match learn fluent French.",
      initials: "SM",
      bg: "bg-emerald-600"
    },
    {
      name: "Rajesh Kumar",
      role: "Photographer / Chef Apprentice",
      content: "I was looking for home-cooking tips. I swapped food photography classes for regional Italian cooking tutorials. Highly recommend the platform for community learning!",
      initials: "RK",
      bg: "bg-rose-600"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 scroll-smooth">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold text-indigo-600 tracking-tight hover:opacity-90 transition-opacity">
                <span>SkillSwap</span>
                <span className="text-xl">🚀</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 items-center">
              <a href="#" className="text-slate-600 hover:text-indigo-600 text-sm font-medium transition-colors">Home</a>
              <a href="#categories" className="text-slate-600 hover:text-indigo-600 text-sm font-medium transition-colors">Browse</a>
              <a href="#how-it-works" className="text-slate-600 hover:text-indigo-600 text-sm font-medium transition-colors">How It Works</a>
              <div className="h-4 w-px bg-slate-200"></div>
              <Link to="/login" className="text-slate-600 hover:text-indigo-600 text-sm font-medium transition-colors">Login</Link>
              <Link
                to="/register"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-indigo-500/10 cursor-pointer"
              >
                Register
              </Link>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-600 hover:text-indigo-600 p-2 outline-none focus:ring-2 focus:ring-indigo-500/20 rounded-md"
              >
                {isMobileMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 shadow-lg absolute w-full left-0 transition-all duration-300">
            <div className="px-4 pt-2 pb-6 space-y-3">
              <a
                href="#"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
              >
                Home
              </a>
              <a
                href="#categories"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
              >
                Browse
              </a>
              <a
                href="#how-it-works"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
              >
                How It Works
              </a>
              <div className="border-t border-slate-100 my-2"></div>
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-center bg-indigo-600 hover:bg-indigo-700 text-white text-base font-semibold px-4 py-2.5 rounded-lg transition"
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-gradient-to-b from-indigo-50/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                </span>
                Peer-to-peer knowledge network
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Exchange Skills, <br />
                <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">Grow Together</span>
              </h1>
              <p className="text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Discover a community where skills are currency. Teach what you love and learn what you want—completely free. Join over 5,000+ local swappers today!
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/register"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-base font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 shadow-md shadow-indigo-600/10 hover:shadow-lg hover:shadow-indigo-600/20 active:scale-[0.99] text-center cursor-pointer"
                >
                  Start Swapping
                </Link>
                <a
                  href="#categories"
                  className="bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-base font-semibold px-8 py-3.5 rounded-xl border border-slate-200 transition-all duration-200 text-center cursor-pointer"
                >
                  Browse Skills
                </a>
              </div>
            </div>

            {/* Right Mockup/Graphic Column */}
            <div className="lg:col-span-5 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-200 to-blue-200 rounded-full blur-3xl opacity-30 -z-10 transform scale-110"></div>
              
              <div className="relative flex flex-col gap-6 max-w-md mx-auto">
                {/* Floating Card 1 */}
                <div className="bg-white p-5 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 transform hover:-translate-y-1 transition duration-300">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm shadow-inner">
                        JS
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 text-sm">Julien S.</h4>
                        <div className="flex items-center gap-1">
                          <Icons.Star />
                          <span className="text-xs text-slate-500 font-bold">4.9 (24 swaps)</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                      Tutors Coding
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    "I can guide you through React and Python basics. Looking to learn photography."
                  </p>
                </div>

                {/* Match indicator connection line */}
                <div className="flex items-center justify-center relative my-1">
                  <div className="w-full border-t-2 border-dashed border-indigo-200 absolute"></div>
                  <div className="z-10 bg-indigo-50 border-2 border-indigo-200 text-indigo-600 font-semibold px-4 py-1.5 rounded-full text-xs flex items-center gap-1.5 shadow-md">
                    <span>⚡ Smart Match</span>
                  </div>
                </div>

                {/* Floating Card 2 */}
                <div className="bg-white p-5 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 transform hover:-translate-y-1 transition duration-300">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-sm shadow-inner">
                        AM
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 text-sm">Aria M.</h4>
                        <div className="flex items-center gap-1">
                          <Icons.Star />
                          <span className="text-xs text-slate-500 font-bold">5.0 (18 swaps)</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                      Tutors Photography
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    "I will teach portrait & landscape photography techniques. I want to build my own website."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 lg:py-28 bg-white border-y border-slate-100 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              How It Works
            </h2>
            <p className="text-slate-600 font-normal leading-relaxed text-base">
              Getting started with SkillSwap is fast and completely free. Here is how you exchange knowledge in three simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting lines for desktop */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-indigo-100 via-indigo-200 to-indigo-100 -z-10"></div>

            {/* Step 1 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                <div className="text-indigo-600 group-hover:text-white transition-colors duration-300">
                  <Icons.Profile />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-2">1. Create Profile</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xs font-normal">
                Register in seconds. List the skills you are ready to teach and the ones you want to learn.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                <div className="text-indigo-600 group-hover:text-white transition-colors duration-300">
                  <Icons.Match />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-2">2. Find a Match</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xs font-normal">
                Our smart directory discovers partners with complementary offers and matching needs.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                <div className="text-indigo-600 group-hover:text-white transition-colors duration-300">
                  <Icons.Swap />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-6 mb-2">3. Start Swapping</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xs font-normal">
                Connect via chat, schedule your video or in-person sessions, and exchange knowledge!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
              Platform Benefits
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Why Choose SkillSwap?
            </h2>
            <p className="text-slate-600 font-normal leading-relaxed text-base">
              A modern learning framework optimized for safety, utility, and authentic human interaction.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-indigo-50/80 border border-indigo-100/50 flex items-center justify-center mb-6">
                    <feature.icon />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-normal">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skill Categories Section */}
      <section id="categories" className="py-20 lg:py-28 bg-white scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Popular Skill Categories
            </h2>
            <p className="text-slate-600 font-normal leading-relaxed text-base">
              Explore swap offers across several fields. Find active teachers or list your own category!
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className={`group relative overflow-hidden bg-gradient-to-br ${cat.color} p-8 rounded-2xl border border-slate-100 hover:border-indigo-200/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-48 cursor-pointer`}
              >
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <cat.icon />
                  </div>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                    {cat.count}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>View all listings</span>
                    <span>&rarr;</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 lg:py-28 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
              Success Stories
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Loved by Learners & Teachers
            </h2>
            <p className="text-slate-600 font-normal leading-relaxed text-base">
              Read how members of our peer network are trading knowledge to reach their personal goals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-2xl border border-slate-200/50 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Icons.Star key={i} />
                    ))}
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed italic font-normal">
                    "{t.content}"
                  </p>
                </div>
                
                <div className="flex items-center gap-3 mt-6 pt-6 border-t border-slate-100">
                  <div className={`w-10 h-10 rounded-full ${t.bg} text-white font-bold flex items-center justify-center text-sm`}>
                    {t.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-950 text-sm leading-none">{t.name}</h4>
                    <span className="text-xs text-slate-500 mt-1 block font-medium">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-12">
            <div className="col-span-2 space-y-4">
              <span className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-1.5">
                <span>SkillSwap</span>
                <span className="text-lg">🚀</span>
              </span>
              <p className="text-sm text-slate-400 max-w-sm leading-relaxed font-normal">
                SkillSwap is a peer-to-peer educational collaborative designed to swap capabilities and grow together. Teach what you excel at, learn what you want. Completely free.
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-white text-sm font-bold uppercase tracking-wider">Company</h4>
              <ul className="space-y-2 text-sm font-normal">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-white text-sm font-bold uppercase tracking-wider">Support</h4>
              <ul className="space-y-2 text-sm font-normal">
                <li><a href="#" className="hover:text-white transition">FAQ / Help</a></li>
                <li><a href="#" className="hover:text-white transition">Safety Center</a></li>
                <li><a href="#" className="hover:text-white transition">Guides</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-white text-sm font-bold uppercase tracking-wider">Legal</h4>
              <ul className="space-y-2 text-sm font-normal">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">Cookie Preferences</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
            <p>&copy; {new Date().getFullYear()} SkillSwap Collaborative. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition">Twitter</a>
              <a href="#" className="hover:text-white transition">LinkedIn</a>
              <a href="#" className="hover:text-white transition">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
