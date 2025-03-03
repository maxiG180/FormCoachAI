import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import AuthCard from "../../components/common/AuthCard";
import ErrorAlert from "../../components/common/ErrorAlert";
import FormInput from "../../components/common/FormInput";
import GoogleIcon from "../../components/icons/GoogleIcon";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, googleSignIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      setError("Failed to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      await googleSignIn();
      navigate("/dashboard");
    } catch (error: any) {
      setError(error.message || "Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="FitCorrect AI Analyzer"
      subtitle="Your AI-Powered Fitness Journey"
    >
      {error && <ErrorAlert message={error} />}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <FormInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
          required
        />

        <FormInput
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          rightElement={
            <Link
              to="/forgot-password"
              className="label-text-alt link link-primary"
            >
              Forgot password?
            </Link>
          }
        />

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      <div className="divider text-base-content/50">or continue with</div>

      <button
        onClick={handleGoogleSignIn}
        className="btn btn-outline btn-block gap-2"
        disabled={loading}
      >
        <GoogleIcon />
        Continue with Google
      </button>

      <p className="text-center mt-4 text-base-content/70">
        Don't have an account?{" "}
        <Link to="/signup" className="link link-primary font-semibold">
          Sign up
        </Link>
      </p>
    </AuthCard>
  );
};

export default Login;
