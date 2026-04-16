import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/layout/Navbar";
import { Pencil } from "lucide-react";

const ManagerUsers = () => {
  const token = localStorage.getItem("token");

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    status: "active",
  });

  // 🔹 API Endpoints
  const FETCH_API_URL = "http://localhost:1080/api/profile/admin";
  const UPDATE_API_URL =
    "http://localhost:1080/api/profile/admin/me";

  // 🔹 Fetch Users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(FETCH_API_URL, {
    
        withCredentials: true
      });

      const data = response.data.users || response.data;

      // Managers cannot view admin profiles
      const nonAdminUsers = data.filter((user) => user.role !== "admin");

      setUsers(nonAdminUsers);
      setFilteredUsers(nonAdminUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔹 Apply Search and Filters
  useEffect(() => {
    let filtered = [...users];

    if (search) {
      filtered = filtered.filter(
        (user) =>
          user.name?.toLowerCase().includes(search.toLowerCase()) ||
          user.email?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (roleFilter) {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  }, [search, roleFilter, statusFilter, users]);

  // 🔹 Open Modal
  const openModal = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      status: user.status || "active",
    });
    setIsModalOpen(true);
  };

  // 🔹 Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  // 🔹 Handle Input Changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔹 Update User
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${UPDATE_API_URL}/${selectedUser._id}`, formData, {
        withCredentials: true
      });

      alert("User updated successfully!");
      closeModal();
      fetchUsers();
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Failed to update user.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar title="Manager - View Users" />

      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">All Users</h1>

        {/* 🔍 Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by name or email"
            className="border p-2 rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border p-2 rounded-lg"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="manager">Manager</option>
            <option value="user">User</option>
          </select>

          <select
            className="border p-2 rounded-lg"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* ⏳ Loading State */}
        {loading && (
          <div className="text-center text-lg font-medium">
            Loading users...
          </div>
        )}

        {/* ❌ Error State */}
        {error && (
          <div className="bg-red-100 text-red-600 p-4 rounded-lg">{error}</div>
        )}

        {/* 📋 Users Table */}
        {!loading && !error && (
          <div className="bg-white shadow-md rounded-xl overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Created At</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="border-t hover:bg-gray-50">
                      <td className="p-4">{user.name}</td>
                      <td className="p-4">{user.email}</td>
                      <td className="p-4 capitalize">{user.role}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 text-sm rounded-full ${
                            user.status === "inactive"
                              ? "bg-red-100 text-red-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {user.status || "active"}
                        </span>
                      </td>
                      <td className="p-4">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => openModal(user)}
                          className="text-indigo-600 hover:text-indigo-800"
                          title="Edit User"
                        >
                          <Pencil size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center p-6 text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ✏️ Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Update User</h2>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-gray-600 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-lg"
                  required
                />
              </div>

              {/* <div>
                <label className="block text-gray-600 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-lg"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div> */}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
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

export default ManagerUsers;
