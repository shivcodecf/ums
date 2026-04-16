import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/layout/Navbar";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    status: "",
  });

  const token = localStorage.getItem("token");
  const API_URL = `http://localhost:1080/api/profile/admin`;

  const fetchUsers = async () => {
    try {
      const res = await axios.get(API_URL, {
        withCredentials: true,
      });

      const data = res.data.users || res.data;
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openModal = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "user",
      status: user.status || "active",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:1080/api/profile/admin/me/${selectedUser._id}`, formData, {
        withCredentials: true,
      });
      closeModal();
      fetchUsers();
    } catch (err) {
      console.error("Update Error:", err);
      alert("Failed to update user.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar title="Admin - Users" />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">All Users</h1>

        {loading && <p>Loading users...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="bg-white shadow-md rounded-xl overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-t hover:bg-gray-50">
                    <td className="p-4">{user.name}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4 capitalize">{user.role}</td>
                    <td className="p-4 capitalize">
                      {user.status || "active"}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => openModal(user)}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        ✏️
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center p-4">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>

            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="user">User</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
