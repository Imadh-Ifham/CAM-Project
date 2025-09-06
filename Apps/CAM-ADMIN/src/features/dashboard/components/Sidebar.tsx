import { useState } from "react";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  return (
    <div
      className={`h-screen bg-cam-bg-800 text-white shadow-lg transition-all duration-300 flex flex-col ${
        open ? "w-64" : "w-16"
      } relative`}
    >
      {/* Toggle Button */}
      <button
        className="absolute -right-4 top-4 w-8 h-8 bg-cam-green-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-cam-green-400 transition-colors z-20"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close sidebar" : "Open sidebar"}
      >
        {/* Hamburger/Chevron Icon */}
        {open ? (
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        ) : (
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        )}
      </button>
      <div className="flex flex-col items-center py-8">
        <div
          className="text-2xl font-bold mb-8 transition-all duration-300"
          style={{
            opacity: open ? 1 : 0,
            pointerEvents: open ? "auto" : "none",
          }}
        >
          Admin
        </div>
        <nav className="flex flex-col gap-4 w-full px-4">
          <a
            href="#"
            className="py-2 px-3 rounded-lg hover:bg-cam-green-500/20 transition-colors text-base font-inter"
          >
            Dashboard
          </a>
          <a
            href="#"
            className="py-2 px-3 rounded-lg hover:bg-cam-green-500/20 transition-colors text-base font-inter"
          >
            Users
          </a>
          <a
            href="#"
            className="py-2 px-3 rounded-lg hover:bg-cam-green-500/20 transition-colors text-base font-inter"
          >
            Settings
          </a>
        </nav>
      </div>
    </div>
  );
}
