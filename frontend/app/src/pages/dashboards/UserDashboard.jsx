import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/layout/Navbar";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";

const UserDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);

  // ✅ Separate loading states
  const [loading, setLoading] = useState(true); // page loading
  const [updateLoading, setUpdateLoading] = useState(false); // form loading

  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const API_URL = `${BASE_URL}/api/profile/user`;
  const UPDATE_API_URL = `${BASE_URL}/api/profile/user/update`;

  // 🔹 Fetch profile
  const fetchUserProfile = async () => {
    try {
      setLoading(true);

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

  // 🔹 Open modal
  const openModal = () => {
    setFormData({
      name: user.name,
      password: "",
    });
    setIsModalOpen(true);
  };

  // 🔹 Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // 🔹 Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔹 Update profile
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setUpdateLoading(true);

      await axios.put(UPDATE_API_URL, formData, {
        withCredentials: true,
      });

      toast.success("Profile updated successfully!");

      closeModal();              // ✅ FIXED
      fetchUserProfile();        // refresh data
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update profile"); // ✅ FIXED
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar title="User Dashboard" />

      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Welcome to Your Dashboard 👋
        </h1>

        {/* Loading */}
        {loading && (
          <div className="text-center text-lg font-medium">
            Loading profile...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-600 p-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Profile */}
        {!loading && !error && user && (
          <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">My Profile</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProfileItem label="Name" value={user.name} />
              <ProfileItem label="Email" value={user.email} />
              <ProfileItem label="Role" value={user.role} />
              <ProfileItem label="Status" value={user.status || "active"} />
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

            {/* Action */}
            <div className="flex gap-4 mt-6">
              <Button onClick={openModal} size="md">
                Edit Profile
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 🔥 Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Edit Profile">
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
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={closeModal}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={updateLoading}   // ✅ FIXED
              loadingText="Updating..."
            >
              Update
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

const ProfileItem = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <p className="text-gray-500 text-sm">{label}</p>
    <p className="text-lg font-semibold text-gray-800">
      {value || "N/A"}
    </p>
  </div>
);

export default UserDashboard;