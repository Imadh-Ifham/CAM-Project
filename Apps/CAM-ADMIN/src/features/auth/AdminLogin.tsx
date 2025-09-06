import { useState } from "react";

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-cam-bg-900 via-cam-bg-800 to-cam-bg-700 relative overflow-hidden">
      {/* Glowing abstract shapes */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cam-green-400 opacity-30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-cam-green-500 opacity-20 rounded-full blur-2xl animate-pulse" />
      <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-cam-green-400 opacity-10 rounded-full blur-2xl animate-pulse -translate-x-1/2 -translate-y-1/2" />
      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md p-8 rounded-2xl bg-cam-bg-700/90 border border-cam-green-400 shadow-glow backdrop-blur-md flex flex-col items-center">
        <h1 className="text-3xl font-bold text-white font-inter mb-2">
          Admin Login
        </h1>
        <p className="text-base text-gray-400 mb-8 font-inter">
          Community Aid Management Portal
        </p>
        <form className="w-full flex flex-col gap-5">
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
              placeholder="admin@community-aid.org"
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-[#262626] text-white placeholder-white/70 border border-transparent focus:border-cam-green-400 focus:ring-2 focus:ring-cam-green-400 outline-none transition-all duration-200 font-inter"
              autoComplete="username"
              required
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
              className="w-full pl-12 pr-10 py-3 rounded-lg bg-[#262626] text-white placeholder-white/70 border border-transparent focus:border-cam-green-400 focus:ring-2 focus:ring-cam-green-400 outline-none transition-all duration-200 font-inter"
              autoComplete="current-password"
              required
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
          {/* Forgot Password */}
          <div className="flex justify-end">
            <a
              href="#"
              className="text-green-500 text-sm hover:underline transition-all font-inter"
            >
              Forgot Password?
            </a>
          </div>
          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-green-500 text-white font-semibold text-lg border border-green-600 shadow-md hover:bg-green-400 transition-all duration-200 font-inter focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Sign In
          </button>
        </form>
        <p className="mt-8 text-xs text-gray-500 font-inter text-center">
          Secure access to community aid management
        </p>
      </div>
    </div>
  );
}
