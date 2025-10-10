import { useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "Yonika De Silva", email: "yd@gmail.com", role: "Admin" },
    { id: 2, name: "Aman Mohomad", email: "aman@gmail.com", role: "Agent" },
    { id: 3, name: "Imadh Ifham", email: "imadh@gmail.com", role: "Admin" },
    { id: 4, name: "Adriel Perera", email: "adriel@gmail.com", role: "Volunteer" },
  ]);

  const [newUser, setNewUser] = useState({ name: "", email: "", role: "" });

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role) return;
    const nextId = users.length + 1;
    setUsers([...users, { id: nextId, ...newUser }]);
    setNewUser({ name: "", email: "", role: "" });
  };

  const handleDelete = (id: number) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Users Management</h1>

      {/* Add New User Form */}
      <div className="mb-6 bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl mb-3 font-semibold">Add New User</h2>
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="p-2 rounded bg-gray-700 text-white w-60"
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="p-2 rounded bg-gray-700 text-white w-60"
          />
          <input
            type="text"
            placeholder="Role"
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="p-2 rounded bg-gray-700 text-white w-60"
          />
          <button
            onClick={handleAddUser}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 text-white rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-700 text-left">
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-600">
                <td className="p-3">{user.id}</td>
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.role}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
