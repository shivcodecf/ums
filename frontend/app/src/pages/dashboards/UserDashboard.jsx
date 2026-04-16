import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/layout/Navbar";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const API_URL = `${BASE_URL}/api/profile/user`;
  const UPDATE_API_URL = `${BASE_URL}/api/profile/user/update`;

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      const userData = response.data.user || response.data;
      setUser(userData);
      setFormData({
        name: userData.name || "",
        password: "",
      });
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError("Failed to load user profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Open modal
  const openModal = () => {
    setFormData({
      name: user.name,
      password: "",
    });
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Update profile
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await axios.put(UPDATE_API_URL, formData, {
        withCredentials: true
      });

      alert("Profile updated successfully!");
      closeModal();
      fetchUserProfile();
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar title="User Dashboard" />

      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Welcome to Your Dashboard 👋
        </h1>

        {loading && (
          <div className="text-center text-lg font-medium">
            Loading profile...
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-600 p-4 rounded-lg">{error}</div>
        )}

        {!loading && !error && user && (
          <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">My Profile</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProfileItem label="Name" value={user.name} />
              <ProfileItem label="Email" value={user.email} />
              <ProfileItem label="Role" value={(user.role)} />
              <ProfileItem
                label="Status"
                value={(user.status || "active")}
              />
              <ProfileItem
                label="Account Created"
                value={
                  user.createdAt
                    ? new Date(user.createdAt).toLocaleString()
                    : "N/A"
                }
              />
              <ProfileItem
                label="Last Updated"
                value={
                  user.updatedAt
                    ? new Date(user.updatedAt).toLocaleString()
                    : "N/A"
                }
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mt-6">
              <button
                onClick={openModal}
                className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700"
              >
                Edit Profile
              </button>

              {/* <button
                onClick={() => navigate("/user/change-password")}
                className="bg-gray-800 text-white px-5 py-2 rounded-lg hover:bg-gray-900"
              >
                Change Password
              </button> */}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {/* {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <DashboardCard
              title="View Profile"
              description="Check your personal details"
              onClick={openModal}
            />
            <DashboardCard
              title="Update Password"
              description="Keep your account secure"
              onClick={() => navigate("/user/change-password")}
            />
          </div>
        )} */}
      </div>

      {/* Edit Profile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

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

const ProfileItem = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <p className="text-gray-500 text-sm">{label}</p>
    <p className="text-lg font-semibold text-gray-800">{value || "N/A"}</p>
  </div>
);

const DashboardCard = ({ title, description, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white shadow-md rounded-xl p-6 cursor-pointer hover:shadow-lg transition"
  >
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-gray-500 mt-2">{description}</p>
  </div>
);

const capitalize = (text) =>
  text ? text.charAt(0).toUpperCase() + text.slice(1) : "";

export default UserDashboard;
