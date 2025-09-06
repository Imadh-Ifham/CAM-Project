import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import MainDashboard from "./MainDashboard";
import AgentManagement from "./AgentManagement";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex bg-black text-white">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-black">
        <Routes>
          <Route path="/" element={<MainDashboard />} />
          <Route
            path="/users"
            element={
              <div className="p-6">
                <h1 className="text-3xl font-bold text-white">
                  Users Management
                </h1>
              </div>
            }
          />
          <Route path="/agents" element={<AgentManagement />} />
          <Route
            path="/settings"
            element={
              <div className="p-6">
                <h1 className="text-3xl font-bold text-white">Settings</h1>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
