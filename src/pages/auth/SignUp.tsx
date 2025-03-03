import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import AuthCard from "../../components/common/AuthCard";
import ErrorAlert from "../../components/common/ErrorAlert";
import FormInput from "../../components/common/FormInput";
import GoogleIcon from "../../components/icons/GoogleIcon";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup, googleSignIn, login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setError("");
    setLoading(true);

    try {
      await signup(email, password);
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      setError("Failed to create an account. Please try again.");
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
      title="FitCorrect AI Coach"
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
        />

        <FormInput
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "Sign up"
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
        Already have an account?{" "}
        <Link to="/login" className="link link-primary font-semibold">
          Login
        </Link>
      </p>
    </AuthCard>
  );
};

export default SignUp;
