import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "../Components/AppBar";

export default function Dashboard() {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowAlert(true);
    }
  }, []);

  const handleSignIn = () => {
    setShowAlert(false);
    navigate("/");
  };

  return (
    <div>
    <AppBar />
    <div className="m-8">
      <h1>Welcome to Dashboard</h1>
      {/* Add your dashboard content here */}
    </div>
    {showAlert && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
        <div className="bg-white p-4 rounded-md shadow-md">
          <p className="mb-2">You are not logged in. Please sign in.</p>
          <button onClick={handleSignIn} className="px-4 text-center py-2 bg-gray-900 text-white rounded-md text-center">Sign In</button>
        </div>
      </div>
    )}
  </div>
  );
}
