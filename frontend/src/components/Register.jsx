import { useState } from "react";
import axios from "axios";

export default function Register({ setToken, setUser, onShowLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/users/register/", {
        username,
        email,
        password,
      });
      setToken(res.data.tokens.access);
      setUser(res.data.user);
      setMessage("Registration successful! You are now logged in.");
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage("Registration failed! " + (err.response?.data?.detail || ""));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-blue-600 tracking-tight flex items-center justify-center gap-2">
            SkillSwap <span className="text-2xl">🚀</span>
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">Peer-to-Peer Knowledge Exchange</p>
        </div>

        <form
          onSubmit={handleRegister}
          className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-100/50 w-full border border-slate-200"
        >
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
            Create Account
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Username
            </label>
            <input
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-800"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-800"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-800"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transform hover:scale-[1.01] active:scale-[0.99] transition-all shadow-md shadow-blue-500/10 cursor-pointer"
          >
            Register
          </button>

          {message && (
            <p className={`mt-4 text-center text-sm font-medium ${message.includes('failed') ? 'text-red-500' : 'text-emerald-600'}`}>
              {message}
            </p>
          )}

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-600 text-sm">
              Already have an account?{" "}
              <button
                type="button"
                onClick={onShowLogin}
                className="text-blue-600 font-bold hover:text-blue-700 hover:underline cursor-pointer"
              >
                Login
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
