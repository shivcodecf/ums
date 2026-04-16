import { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  UserPlus,
  ShieldCheck,
  UserCheck,
  UserCircle,
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    admins: 0,
    managers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Profile States
  const [showProfile, setShowProfile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [admin, setAdmin] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const API_URL = `${BASE_URL}/api`;

  // const API_BASE_URL = "http://localhost:1080/api";

  /* ---------------- Fetch Dashboard Stats ---------------- */
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/profile/admin`,
          { withCredentials: true }
        );

        const users = response.data.users || response.data;

        const totalUsers = users.length;
        const admins = users.filter((u) => u.role === "admin").length+1;
        const managers = users.filter((u) => u.role === "manager").length;
        const activeUsers = users.filter(
          (u) => u.status === "active"
        ).length;
        const inactiveUsers = users.filter(
          (u) => u.status === "inactive"
        ).length;

        setStats({
          totalUsers,
          admins,
          managers,
          activeUsers,
          inactiveUsers,
        });
      } catch (err) {
        console.error(err);
        setError("Failed to fetch dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  /* ---------------- Fetch Admin Profile ---------------- */
  const fetchAdminProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/profile/user`, {
        withCredentials: true,
      });

      const user = res.data.user || res.data;
      setAdmin(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
      });
      setShowProfile(true);
    } catch (error) {
      console.error("Error fetching profile:", error);
      alert("Failed to load admin profile.");
    }
  };

  /* ---------------- Handle Input Changes ---------------- */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ---------------- Update Admin Profile ---------------- */
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${API_BASE_URL}/profile/user/update`,
        formData,
        { withCredentials: true }
      );

      alert("Profile updated successfully!");
      setIsModalOpen(false);
      fetchAdminProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(
        error.response?.data?.message ||
          "Failed to update profile."
      );
    }
  };

  /* ---------------- Loading & Error States ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar title="Admin Dashboard" />

      <div className="p-6">
        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Welcome, Admin 👑
        </h1>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<Users size={28} />}
            color="bg-blue-500"
          />
          <StatCard
            title="Admins"
            value={stats.admins}
            icon={<ShieldCheck size={28} />}
            color="bg-purple-500"
          />
          <StatCard
            title="Managers"
            value={stats.managers}
            icon={<UserCheck size={28} />}
            color="bg-indigo-500"
          />
          <StatCard
            title="Active Users"
            value={stats.activeUsers}
            icon={<Users size={28} />}
            color="bg-green-500"
          />
          <StatCard
            title="Inactive Users"
            value={stats.inactiveUsers}
            icon={<Users size={28} />}
            color="bg-red-500"
          />
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-semibold text-gray-800 mt-10 mb-4">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ActionCard
            title="Manage Users"
            description="View, edit, and delete users"
            icon={<Users size={28} />}
            onClick={() => navigate("/admin/users")}
          />
          <ActionCard
            title="Create User"
            description="Add new users to the system"
            icon={<UserPlus size={28} />}
            onClick={() => navigate("/admin/create-user")}
          />
          {/* <ActionCard
            title="System Control"
            description="Manage roles and permissions"
            icon={<ShieldCheck size={28} />}
            onClick={() => navigate("/admin/users")}
          /> */}
          <ActionCard
            title="My Profile"
            description="View and update your profile"
            icon={<UserCircle size={28} />}
            onClick={fetchAdminProfile}
          />
        </div>

        {/* Admin Profile Section */}
        {showProfile && admin && (
          <div className="mt-10 bg-white shadow-md rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">
              My Profile
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProfileItem label="Name" value={admin.name} />
              <ProfileItem label="Email" value={admin.email} />
              <ProfileItem
                label="Role"
                value={admin.role}
                capitalize
              />
              <ProfileItem
                label="Status"
                value={admin.status || "active"}
                capitalize
              />
              <ProfileItem
                label="Created At"
                value={
                  admin.createdAt
                    ? new Date(admin.createdAt).toLocaleString()
                    : "N/A"
                }
              />
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-6 bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">
              Edit Profile
            </h2>

            <form
              onSubmit={handleUpdateProfile}
              className="space-y-4"
            >
              <div>
                <label className="block text-gray-600 mb-1">
                  Name
                </label>
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
                <label className="block text-gray-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-lg"
                  placeholder="Leave blank to keep unchanged"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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

/* ---------- Statistic Card ---------- */
const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white shadow-md rounded-xl p-5 flex items-center justify-between hover:shadow-lg transition">
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-2xl font-bold text-gray-800">{value}</h2>
    </div>
    <div className={`${color} text-white p-3 rounded-lg`}>
      {icon}
    </div>
  </div>
);

/* ---------- Action Card ---------- */
const ActionCard = ({ title, description, icon, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg cursor-pointer transition"
  >
    <div className="text-indigo-600 mb-3">{icon}</div>
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-gray-500 text-sm mt-1">
      {description}
    </p>
  </div>
);

/* ---------- Profile Item ---------- */
const ProfileItem = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <p className="text-gray-500 text-sm">{label}</p>
    <p className="text-lg font-semibold text-gray-800">
      {value || "N/A"}
    </p>
  </div>
);

export default AdminDashboard;