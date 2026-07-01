
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import ChatRoomPage from "./components/ChatRoomPage";
import LandingPage from "./components/LandingPage";
import Profile from "./components/Profile";
import Teach from "./components/Teach";
import Browse from "./components/Browse";

function LoginWrapper({ setToken, setUser }) {
  const navigate = useNavigate();
  return <Login setToken={setToken} setUser={setUser} onShowRegister={() => navigate("/register")} />;
}

function RegisterWrapper({ setToken, setUser }) {
  const navigate = useNavigate();
  return <Register setToken={setToken} setUser={setUser} onShowLogin={() => navigate("/login")} />;
}

function App() {
  const [token, setToken] = useState(() => {
    const saved = localStorage.getItem("access");
    return saved && saved !== "undefined" && saved !== "null" ? saved : null;
  });
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem("access", token);
    } else {
      localStorage.removeItem("access");
      localStorage.removeItem("user");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setShowRegister(false);
  };

  return (
    <Router>
      <Routes>
        {!token ? (
          <>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginWrapper setToken={setToken} setUser={setUser} />} />
            <Route path="/register" element={<RegisterWrapper setToken={setToken} setUser={setUser} />} />
            <Route path="/profile" element={<Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Dashboard token={token} user={user} onLogout={handleLogout} />} />
            <Route path="/profile" element={<Profile token={token} onLogout={handleLogout} />} />
            <Route path="/teach" element={<Teach token={token} />} />
            <Route path="/browse" element={<Browse token={token} />} />
            <Route path="/chat/:swapId" element={<ChatRoomPage />} />
            <Route path="/login" element={<Navigate to="/" />} />
            <Route path="/register" element={<Navigate to="/" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;



// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<div>Hello React!</div>} />
//       </Routes>
//     </Router>
//   );
// }

//export default App;