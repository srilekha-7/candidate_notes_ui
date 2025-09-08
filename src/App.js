import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import ChatBook from "./pages/ChatBook";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const PrivateRoute = ({ children }) => {
    if (loading) return null;

    return user ? children : <Navigate to="/login" />;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { padding: "12px 16px", borderRadius: "8px", fontSize: "14px" },
          success: {
            style: { background: "#22c55e", color: "#fff" },
            iconTheme: { primary: "#fff", secondary: "#22c55e" },
          },
          error: {
            style: { background: "#ef4444", color: "#fff" },
            iconTheme: { primary: "#fff", secondary: "#ef4444" },
          },
        }}
      />

      <Routes>
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/signup" element={<SignupPage setUser={setUser} />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage user={user} setUser={setUser} />
            </PrivateRoute>
          }
        />
        <Route
          path="/candidate/:id/notes"
          element={
            <PrivateRoute>
              <ChatBook user={user} setUser={setUser} />
            </PrivateRoute>
          }
        />


        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
