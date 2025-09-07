import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "admin@gmail.com" && password === "Aman14924") {
      setError("");
      setSuccess(true);
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1500);
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-cam-green-950 via-cam-bg-900 to-cam-bg-800"
      style={{ background: "#23272f" }}
    >
      {/* Glowing abstract shapes */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cam-green-400 opacity-30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-cam-green-500 opacity-20 rounded-full blur-2xl animate-pulse" />
      <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-cam-green-400 opacity-10 rounded-full blur-2xl animate-pulse -translate-x-1/2 -translate-y-1/2" />
      {/* Login Card */}
      <div
        className="relative z-10 w-full max-w-md p-10 rounded-3xl bg-cam-bg-800/80 border-2 border-transparent bg-clip-padding backdrop-blur-xl shadow-2xl flex flex-col items-center"
        style={{
          boxShadow: "0 8px 40px 0 rgba(16,255,120,0.10), 0 1.5px 0 0 #4ade80",
          borderImage: "linear-gradient(135deg, #4ade80 0%, #22d3ee 100%) 1",
        }}
      >
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cam-green-400 to-cam-green-600 flex items-center justify-center mb-3 shadow-lg">
            <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
              <path
                stroke="#fff"
                strokeWidth="2"
                d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.418 0-8 2.239-8 5v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1c0-2.761-3.582-5-8-5Z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-white font-inter mb-1 drop-shadow-lg">
            Admin Login
          </h1>
          <p className="text-base text-green-200 mb-2 font-inter">
            Community Aid Management Portal
          </p>
        </div>
        <form className="w-full flex flex-col gap-6" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cam-green-400">
              {/* User Icon */}
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.418 0-8 2.239-8 5v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1c0-2.761-3.582-5-8-5Z"
                />
              </svg>
            </span>
            <input
              type="email"
              placeholder="admin@gmail.com"
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-[#23272f] text-white placeholder-white/70 border border-cam-green-700 focus:border-cam-green-400 focus:ring-2 focus:ring-cam-green-400 outline-none transition-all duration-200 font-inter shadow-sm"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {/* Password */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cam-green-400">
              {/* Lock Icon */}
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <rect
                  width="16"
                  height="10"
                  x="4"
                  y="11"
                  stroke="currentColor"
                  strokeWidth="2"
                  rx="2"
                />
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  d="M8 11V7a4 4 0 1 1 8 0v4"
                />
              </svg>
            </span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full pl-12 pr-10 py-3 rounded-lg bg-[#23272f] text-white placeholder-white/70 border border-cam-green-700 focus:border-cam-green-400 focus:ring-2 focus:ring-cam-green-400 outline-none transition-all duration-200 font-inter shadow-sm"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cam-green-400 transition-colors"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {/* Eye Icon */}
              {showPassword ? (
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    d="M3 12s3.6-7 9-7 9 7 9 7-3.6 7-9 7-9-7-9-7Z"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              ) : (
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    d="M17.94 17.94A9.956 9.956 0 0 1 12 19c-5.4 0-9-7-9-7a18.6 18.6 0 0 1 3.06-4.94M9.88 9.88A3 3 0 0 1 12 9c1.66 0 3 1.34 3 3 0 .42-.09.82-.24 1.18M6.1 6.1A9.956 9.956 0 0 1 12 5c5.4 0 9 7 9 7a18.6 18.6 0 0 1-4.06 5.94M3 3l18 18"
                  />
                </svg>
              )}
            </button>
          </div>
          {/* Error/Success Message */}
          {error && (
            <div className="text-red-500 text-sm text-right font-inter">
              {error}
            </div>
          )}
          {success && (
            <div className="text-green-400 text-center text-sm font-inter mb-2 animate-pulse">
              Redirecting to admin dashboard...
            </div>
          )}
          {/* Forgot Password */}
          <div className="flex justify-end">
            <a
              href="#"
              className="text-cam-green-400 text-sm hover:underline transition-all font-inter"
            >
              Forgot Password?
            </a>
          </div>
          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-cam-green-400 text-white font-semibold text-lg border-none shadow-lg hover:bg-cam-green-500 transition-all duration-200 font-inter focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Sign In
          </button>
        </form>
        <p className="mt-8 text-xs text-gray-400 font-inter text-center">
          Secure access to community aid management
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
