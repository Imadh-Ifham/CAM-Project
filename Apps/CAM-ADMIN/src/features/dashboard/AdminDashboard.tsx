import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import MainDashboard from "./MainDashboard";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex bg-cam-bg-900 text-white">
      <Sidebar />
      <main className="flex-1 overflow-auto">
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
