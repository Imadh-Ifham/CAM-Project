import { useState } from "react";
import { Home, Users, Settings, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  return (
    <div
      className={`h-screen text-white transition-all duration-300 flex flex-col ${
        open ? "w-64" : "w-16"
      } relative`}
      style={{
        background: "#23272f",
        boxShadow: "2px 0 16px 0 rgba(0,0,0,0.18)",
      }}
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
        <nav className="flex flex-col gap-4 w-full px-2">
          <Link
            to="/admin/dashboard"
            className={`flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-cam-green-500/20 transition-colors font-inter ${
              open ? "justify-start" : "justify-center"
            }`}
            title={open ? undefined : "Dashboard"}
          >
            <Home size={22} />
            {open && <span className="text-base">Dashboard</span>}
          </Link>
          <Link
            to="/admin/dashboard/users"
            className={`flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-cam-green-500/20 transition-colors font-inter ${
              open ? "justify-start" : "justify-center"
            }`}
            title={open ? undefined : "Users"}
          >
            <Users size={22} />
            {open && <span className="text-base">Users</span>}
          </Link>
          <Link
            to="/admin/dashboard/agents"
            className={`flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-cam-green-500/20 transition-colors font-inter ${
              open ? "justify-start" : "justify-center"
            }`}
            title={open ? undefined : "Agents"}
          >
            <UserCheck size={22} />
            {open && <span className="text-base">Agents</span>}
          </Link>
          <Link
            to="/admin/dashboard/settings"
            className={`flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-cam-green-500/20 transition-colors font-inter ${
              open ? "justify-start" : "justify-center"
            }`}
            title={open ? undefined : "Settings"}
          >
            <Settings size={22} />
            {open && <span className="text-base">Settings</span>}
          </Link>
        </nav>
      </div>
    </div>
  );
}
