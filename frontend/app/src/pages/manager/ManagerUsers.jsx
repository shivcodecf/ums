import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/layout/Navbar";
import { Pencil } from "lucide-react";
import { toast } from "react-toastify";

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

  const FETCH_API_URL = `${BASE_URL}/api/profile/admin`;
  const UPDATE_API_URL = `${BASE_URL}/api/profile/admin/me`;

  // 🔹 Fetch Users
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${FETCH_API_URL}?page=${currentPage}&limit=${usersPerPage}&search=${search}&role=${roleFilter}&status=${statusFilter}`,
        { withCredentials: true }
      );

      const data = response.data.users || [];

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

  // 🔹 Handle Input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔹 Update User
  const handleUpdate = async () => {
  try {
    await axios.put(`${UPDATE_API_URL}/${selectedUser._id}`, formData, {
      withCredentials: true,
    });

    toast.success("User updated successfully!");

    fetchUsers(); // first update list

    setTimeout(() => {
      closeModal();   // ✅ close AFTER render cycle
    }, 0);

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

        {/* Filters */}
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

        {/* Loading */}
        {loading && (
          <div className="text-center text-lg font-medium">
            Loading users...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-600 p-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Table */}
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
                {users.map((user) => (
                  <tr key={user._id} className="border-t hover:bg-gray-50">
                    <td className="p-4">{user.name}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4 capitalize">{user.role}</td>
                    <td className="p-4">{user.status || "active"}</td>
                    <td className="p-4">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-4 text-center">
                      <button onClick={() => openModal(user)}>
                        <Pencil size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Update User</h2>

            <div className="space-y-4">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
              />

              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
              />

              <div className="flex justify-end gap-3">
                <button onClick={closeModal}>Cancel</button>

                <button onClick={handleUpdate}>Update</button> {/* ✅ FIX */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerUsers;