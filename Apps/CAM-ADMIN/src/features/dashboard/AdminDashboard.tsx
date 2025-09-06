import Sidebar from "./components/Sidebar";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex bg-cam-bg-900 text-white">
      <Sidebar />
      <main className="flex-1 flex items-center justify-center">
        <h1 className="text-3xl font-bold">Welcome to the Admin Dashboard!</h1>
      </main>
    </div>
  );
}
