import { useState } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";

export default function Login({ setToken, setUser, onShowRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/token/", {
        username,
        password,
      });
      setToken(response.data.access);
      // For standard login, we might need another call to get user info if simple-jwt doesn't return it
      // But for now let's assume we just set token.
      setMessage("Login successful!");
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage("Login failed! Please check your credentials.");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/users/google-login/", {
        token: credentialResponse.credential,
      });
      setToken(response.data.access);
      setUser(response.data.user);
      setMessage("Google Login successful!");
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage("Google Login failed!");
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
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-100/50 w-full border border-slate-200"
        >
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
            Welcome Back
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              placeholder="Enter your password"
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
            Login
          </button>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="mx-4 text-slate-400 text-xs font-semibold uppercase tracking-wider">OR</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setMessage("Google Login failed!")}
              useOneTap
              theme="outline"
              size="large"
              width="100%"
            />
          </div>

          {message && (
            <p className={`mt-4 text-center text-sm font-medium ${message.includes('failed') ? 'text-red-600' : 'text-emerald-600'}`}>
              {message}
            </p>
          )}

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-600 text-sm">
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={onShowRegister}
                className="text-blue-600 font-bold hover:text-blue-700 hover:underline cursor-pointer"
              >
                Create Account
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
