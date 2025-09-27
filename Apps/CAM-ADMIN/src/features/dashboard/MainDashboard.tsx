import { BarChart3, Users, FileCheck, UserCheck } from "lucide-react";

export default function MainDashboard() {
  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold text-cam-green-500 mb-8 animate-fadeIn">
        Dashboard Analytics
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value="5"
          icon={<Users className="text-blue-500" />}
          change="+2"
          positive={true}
          animationDelay="0.1s"
        />
        <StatCard
          title="Agent Registrations"
          value="2"
          icon={<UserCheck className="text-green-500" />}
          change="+1"
          positive={true}
          animationDelay="0.2s"
        />
        <StatCard
          title="Requests Processed"
          value="1"
          icon={<FileCheck className="text-purple-500" />}
          change="New"
          positive={true}
          animationDelay="0.3s"
        />
        <StatCard
          title="Acceptance Rate"
          value="98%"
          icon={<BarChart3 className="text-amber-500" />}
          change="+5%"
          positive={true}
          animationDelay="0.4s"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-cam-bg-800 p-6 rounded-xl border border-gray-700 shadow-md animate-slideInFromLeft">
          <h2 className="text-xl font-bold mb-4 text-cam-green-500">
            User Registrations
          </h2>
          <div className="h-60 flex items-end justify-around">
            {[40, 15, 65, 35, 10, 80, 25].map((height, i) => (
              <div key={i} className="relative w-1/12 group">
                <div
                  style={{
                    height: `${height}%`,
                    animation: `growFromBottom 1s ease-out forwards`,
                    animationDelay: `${0.1 * i}s`,
                  }}
                  className={`bg-gradient-to-t from-cam-green-500 to-cam-green-400 rounded-t-md w-full 
                              transition-all duration-300 hover:opacity-80 hover:shadow-glow
                              transform origin-bottom ${
                                i === 2 || i === 5
                                  ? "from-green-600 to-green-400 shadow-lg shadow-green-500/20"
                                  : ""
                              }`}
                ></div>
                <div className="text-xs mt-2 text-gray-400 text-center">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                </div>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-cam-bg-700 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {height * 10}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-cam-bg-800 p-6 rounded-xl border border-gray-700 shadow-md animate-slideInFromRight">
          <h2 className="text-xl font-bold mb-4 text-cam-green-500">
            Agent Performance
          </h2>
          <div className="h-60 flex items-center justify-center">
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#1a1a1a"
                strokeWidth="10"
              />
              {/* 68% of the circle (68% of 2π×r) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#4ade80"
                strokeWidth="10"
                strokeDasharray="251.2 5.0"
                strokeDashoffset="94.2"
                transform="rotate(-90 50 50)"
              />
              <text
                x="50"
                y="50"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize="12"
                fontWeight="bold"
              >
                98%
              </text>
              <text
                x="50"
                y="64"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#a3a3a3"
                fontSize="8"
              >
                Acceptance Rate
              </text>
            </svg>
          </div>
        </div>
      </div>

      {/* Recent Agent Registrations */}
      <div className="bg-cam-bg-800 p-6 rounded-xl border border-gray-700 shadow-md animate-slideInFromBottom">
        <h2 className="text-xl font-bold mb-4 text-cam-green-500">
          Recent Agent Registrations
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left text-sm font-medium text-gray-400 pb-3">
                  Agent
                </th>
                <th className="text-left text-sm font-medium text-gray-400 pb-3">
                  Action
                </th>
                <th className="text-left text-sm font-medium text-gray-400 pb-3">
                  Status
                </th>
                <th className="text-left text-sm font-medium text-gray-400 pb-3">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  agent: "Aman",
                  action: "Agent Registration",
                  status: "Approved",
                  time: "2 days ago",
                },
                {
                  agent: "Imadh",
                  action: "Agent Registration",
                  status: "Denied",
                  time: "1 day ago",
                },
              ].map((item, i) => (
                <tr key={i} className="border-t border-gray-700">
                  <td className="py-3 text-white">{item.agent}</td>
                  <td className="py-3 text-gray-300">{item.action}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        item.status === "Completed"
                          ? "bg-green-900/30 text-green-400"
                          : item.status === "In Progress"
                          ? "bg-blue-900/30 text-blue-400"
                          : "bg-amber-900/30 text-amber-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 text-gray-400 text-sm">{item.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Stats Card Component
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: string;
  positive: boolean;
  animationDelay?: string;
}

function StatCard({
  title,
  value,
  icon,
  change,
  positive,
  animationDelay = "0s",
}: StatCardProps) {
  return (
    <div
      className="bg-cam-bg-800 p-6 rounded-xl border border-gray-700 shadow-md animate-fadeIn 
                 transition-all duration-300 hover:shadow-glow hover:border-cam-green-500/50 cursor-pointer"
      style={{ animationDelay }}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-cam-green-400 text-sm font-medium">{title}</h3>
        <div className="p-2 rounded-lg bg-cam-bg-700">{icon}</div>
      </div>
      <div className="flex items-baseline">
        <span className="text-2xl font-bold text-white">{value}</span>
        <span
          className={`ml-2 text-sm ${
            positive ? "text-green-400" : "text-red-400"
          }`}
        >
          {change}
        </span>
      </div>
    </div>
  );
}
