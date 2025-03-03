// App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import NavBar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import Analyze from "./pages/Analyze";
import Pricing from "./pages/Pricing";
//import "./config/firebase.ts";

const App = () => {
  const { user, loading } = useAuth();

  // Show loading spinner while auth state is being determined
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-dark">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-brand-dark">
      <NavBar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/analyze" element={<Analyze />} />

          {/* Auth Routes - Redirect to /analyze if already authenticated */}
          <Route
            path="/login"
            element={user ? <Navigate to="/analyze" replace /> : <Login />}
          />
          <Route
            path="/signup"
            element={user ? <Navigate to="/analyze" replace /> : <SignUp />}
          />

          {/* Catch all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
