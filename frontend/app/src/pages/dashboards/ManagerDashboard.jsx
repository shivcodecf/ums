import { useState } from "react";
import Navbar from "../../components/layout/Navbar";
import { useNavigate } from "react-router-dom";
import { Users, UserCircle, KeyRound } from "lucide-react";
import axios from "axios";

const ManagerDashboard = () => {
  const navigate = useNavigate();

  const [showProfile, setShowProfile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [manager, setManager] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const API_BASE_URL = "http://localhost:1080/api";

  // Fetch Manager Profile
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/profile/user`, {
        withCredentials: true,
      });

      const user = res.data.user || res.data;
      setManager(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
      });
      setShowProfile(true);
    } catch (error) {
      console.error("Error fetching profile:", error);
      alert("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  // Open Edit Modal
  const openEditModal = () => {
    setIsModalOpen(true);
  };

  // Close Edit Modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Update Profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/profile/user/update`, formData, {
        withCredentials: true,
      });

      alert("Profile updated successfully!");
      setIsModalOpen(false);
      fetchProfile(); // Refresh data
    } catch (error) {
      console.error("Update error:", error);
      alert(error.response?.data?.message || "Failed to update profile.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar title="Manager Dashboard" />

      <div className="p-6 max-w-6xl mx-auto">
        {/* Welcome Section */}
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Welcome, Manager 👨‍💼
        </h1>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DashboardCard
            title="View Users"
            description="Browse and review all registered users"
            icon={<Users size={32} />}
            onClick={() => navigate("/manager/users")}
          />

          <DashboardCard
            title="My Profile"
            description="View and update your profile"
            icon={<UserCircle size={32} />}
            onClick={fetchProfile}
          />

          {/* <DashboardCard
            title="Change Password"
            description="Update your account password"
            icon={<KeyRound size={32} />}
            onClick={() => navigate("/manager/change-password")}
          /> */}
        </div>

        {/* Profile Details Card */}
        {showProfile && (
          <div className="mt-10 bg-white shadow-md rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">My Profile</h2>

            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProfileItem label="Name" value={manager?.name} />
                <ProfileItem label="Email" value={manager?.email} />
                <ProfileItem label="Role" value={manager?.role} />
                <ProfileItem
                  label="Status"
                  value={manager?.status || "active"}
                />
                <ProfileItem
                  label="Created At"
                  value={
                    manager?.createdAt
                      ? new Date(manager.createdAt).toLocaleString()
                      : "N/A"
                  }
                />
              </div>
            )}

            <div className="mt-6">
              <button
                onClick={openEditModal}
                className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700"
              >
                Edit Profile
              </button>
            </div>
          </div>
        )}

        {/* Information Section */}
        <div className="mt-10 bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-3">Manager Permissions</h2>
          <ul className="list-disc pl-5 text-gray-600 space-y-2">
            <li>View all users and their details</li>
            <li>Search and filter users</li>
            <li>View personal profile information</li>
            <li>Update own name, email, and password</li>
            <li>Cannot create, delete, or modify user roles or status</li>
          </ul>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
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

              <div>
                <label className="block text-gray-600 mb-1">New Password</label>
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

const DashboardCard = ({ title, description, icon, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white shadow-md rounded-xl p-6 cursor-pointer hover:shadow-lg hover:scale-105 transition duration-300"
  >
    <div className="text-indigo-600 mb-4">{icon}</div>
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-gray-500 mt-2">{description}</p>
  </div>
);

const ProfileItem = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <p className="text-gray-500 text-sm">{label}</p>
    <p className="text-lg font-semibold text-gray-800 ">
      {value || "N/A"}
    </p>
  </div>
);

export default ManagerDashboard;
