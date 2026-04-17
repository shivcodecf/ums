import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/layout/Navbar";
import { Pencil } from "lucide-react";

const ManagerUsers = () => {
  const [users, setUsers] = useState([]);
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

  // 🔹 Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // 🔹 API Endpoints
  const FETCH_API_URL = `${BASE_URL}/api/profile/admin`;

  const UPDATE_API_URL = `${BASE_URL}/api/profile/admin/me`;

  // 🔹 Fetch Users with Pagination
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${FETCH_API_URL}?page=${currentPage}&limit=${usersPerPage}&search=${search}&role=${roleFilter}&status=${statusFilter}`,
        { withCredentials: true },
      );

      const data = response.data.users || [];

      // Managers cannot view admin profiles
      const nonAdminUsers = data.filter((user) => user.role !== "admin");

      setUsers(nonAdminUsers);
      setTotalPages(response.data.pagination?.totalPages || 1);
      setTotalUsers(response.data.pagination?.totalUsers || 0);
      setError("");
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, usersPerPage, search, roleFilter, statusFilter]);

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
        withCredentials: true,
      });

      toast.success("User updated successfully!");
      closeModal();
      fetchUsers();
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error("Failed to update user.");
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
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />

          <select
            className="border p-2 rounded-lg"
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Roles</option>
            <option value="manager">Manager</option>
            <option value="user">User</option>
          </select>

          <select
            className="border p-2 rounded-lg"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
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
                {users.length > 0 ? (
                  users.map((user) => (
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

        {/* 🔢 Pagination Controls */}
        {!loading && !error && (
          <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
            {/* Rows Per Page */}
            <div className="flex items-center gap-2">
              <label className="text-gray-600">Rows per page:</label>
              <select
                value={usersPerPage}
                onChange={(e) => {
                  setUsersPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border rounded px-2 py-1"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
              </select>
            </div>

            {/* Page Info */}
            <div className="font-medium text-gray-700">
              Page {currentPage} of {totalPages}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded ${
                  currentPage === 1
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                Previous
              </button>

              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded ${
                  currentPage === totalPages
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Total Users */}
        {!loading && !error && (
          <p className="text-center text-gray-600 mt-2">
            Total Users: {totalUsers}
          </p>
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
