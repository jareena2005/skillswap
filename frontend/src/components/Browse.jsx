import { Link } from "react-router-dom";

export default function Browse() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">Browse</p>
          <h1 className="mt-4 text-3xl font-bold text-slate-900">Find your next swap match</h1>
          <p className="mt-3 text-slate-600">This page will show matches based on the skills you teach and want to learn.</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <div className="text-slate-500">
            <p className="mb-3">Your matches are being generated from the skills you saved on the teach page.</p>
            <p className="text-sm">In the current build, this page is a placeholder that confirms the redirect after saving your profile.</p>
          </div>
          <Link
            to="/"
            className="mt-6 inline-flex items-center rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-500/20 hover:bg-indigo-700 transition"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
