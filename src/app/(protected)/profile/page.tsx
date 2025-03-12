"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useAuth } from "@/contexts/authContext";
import ErrorAlert from "@/components/ui/errorAlert";
import FormInput from "@/components/ui/formInput";
import { ArrowLeft, Save, Lock, User as UserIcon } from "lucide-react";
import Link from "next/link";

interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string;
  updatedAt?: Date;
}

export default function ProfileSettings() {
  const { user, updateUserPassword, reauthenticateUser } = useAuth();
  const router = useRouter();

  // Profile data
  const [displayName, setDisplayName] = useState("");

  // Account data
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [reAuthRequired, setReAuthRequired] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    loadUserProfile();
  }, [user, router]);

  const loadUserProfile = async () => {
    if (!user?.uid) return;

    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data() as UserProfile;
        setDisplayName(userData.displayName || "");
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    if (!user?.uid) {
      setError("You must be logged in to update your profile");
      setLoading(false);
      return;
    }

    try {
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName,
        updatedAt: new Date(),
      };

      await setDoc(doc(db, "users", user.uid), userData, { merge: true });
      setMessage("Profile updated successfully");
    } catch (error: any) {
      setError(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleAccountUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    // Validate fields
    if (newPassword && newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (newPassword && !currentPassword) {
      setReAuthRequired(true);
      setLoading(false);
      return;
    }

    try {
      // Re-authenticate if needed
      if (reAuthRequired) {
        await reauthenticateUser(currentPassword);
        setReAuthRequired(false);
      }

      // Update password if provided
      if (newPassword) {
        await updateUserPassword(newPassword);
        setNewPassword("");
        setConfirmPassword("");
      }

      setCurrentPassword("");
      setMessage("Password updated successfully");
    } catch (error: any) {
      if (error.code === "auth/requires-recent-login") {
        setReAuthRequired(true);
      } else {
        setError(error.message || "Failed to update account");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-black">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-gray-400 hover:text-[#FF6500] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-black border border-[#FF6500]/30 rounded-xl p-6 shadow-lg">
          <h1 className="text-2xl font-bold text-white mb-2">
            Profile <span className="text-[#FF6500]">Settings</span>
          </h1>
          <p className="text-gray-400 mb-8">
            Customize your profile and account settings
          </p>

          {/* Tabs */}
          <div className="border-b border-[#FF6500]/20 flex mb-8">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center pb-3 px-4 font-medium ${
                activeTab === "profile"
                  ? "text-[#FF6500] border-b-2 border-[#FF6500]"
                  : "text-gray-400 hover:text-[#FF6500]/70"
              } transition-colors`}
            >
              <UserIcon className="w-4 h-4 mr-2" />
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab("account")}
              className={`flex items-center pb-3 px-4 font-medium ${
                activeTab === "account"
                  ? "text-[#FF6500] border-b-2 border-[#FF6500]"
                  : "text-gray-400 hover:text-[#FF6500]/70"
              } transition-colors`}
            >
              <Lock className="w-4 h-4 mr-2" />
              Security Settings
            </button>
          </div>

          {/* Success/Error Messages */}
          {error && <ErrorAlert message={error} />}
          {message && (
            <div className="bg-green-500/20 text-green-400 p-4 rounded-lg mb-6">
              <p>{message}</p>
            </div>
          )}

          {/* Profile Information Form */}
          {activeTab === "profile" && (
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <FormInput
                label="Display Name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
              />

              <div className="text-gray-400 p-4 bg-gray-900/50 rounded-lg">
                <p className="font-medium mb-2">Email</p>
                <p>{user?.email}</p>
                <p className="text-sm mt-2 text-gray-500">
                  Email cannot be changed for security reasons.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#FF6500] hover:bg-[#FF8533] text-white font-medium rounded-lg transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span>Updating profile...</span>
                  </div>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Save Profile
                  </>
                )}
              </button>
            </form>
          )}

          {/* Account Settings Form */}
          {activeTab === "account" && (
            <form onSubmit={handleAccountUpdate} className="space-y-6">
              {reAuthRequired ? (
                <div className="bg-yellow-500/20 text-yellow-400 p-4 rounded-lg mb-6">
                  <p className="font-medium mb-2">Authentication Required</p>
                  <p className="text-sm mb-4">
                    For security reasons, please enter your current password to
                    continue.
                  </p>
                  <FormInput
                    label="Current Password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
              ) : (
                <div className="pt-2">
                  <h3 className="text-lg font-medium text-white mb-4">
                    Change Password
                  </h3>

                  <div className="space-y-6">
                    <FormInput
                      label="New Password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                    />

                    <FormInput
                      label="Confirm New Password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                    />

                    {newPassword && (
                      <FormInput
                        label="Current Password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                      />
                    )}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !newPassword}
                className="w-full py-3 px-4 bg-[#FF6500] hover:bg-[#FF8533] text-white font-medium rounded-lg transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span>
                      {reAuthRequired
                        ? "Authenticating..."
                        : "Updating password..."}
                    </span>
                  </div>
                ) : (
                  <>
                    <Lock className="w-5 h-5 mr-2" />
                    {reAuthRequired ? "Authenticate" : "Update Password"}
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
