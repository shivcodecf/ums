import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";

const CreateUser = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    status: "active",
    password: "",
  });

  const [autoGeneratePassword, setAutoGeneratePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API_URL = `http://localhost:1080/api/profile/admin/create`;

  // Generate a random password
  const generatePassword = () => {
    const randomPassword = Math.random().toString(36).slice(-8) + "@A1";
    setFormData({ ...formData, password: randomPassword });
  };

  const handleAutoGenerate = () => {
    const newValue = !autoGeneratePassword;
    setAutoGeneratePassword(newValue);

    if (newValue) {
      generatePassword();
    } else {
      setFormData({ ...formData, password: "" });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name || !formData.email) {
      setError("Name and Email are required.");
      return;
    }

    if (!formData.password) {
      setError("Password is required.");
      return;
    }

    try {
      setLoading(true);

      await axios.post(API_URL, formData, {
       
        withCredentials:true
       
      });

      setSuccess("User created successfully!");

      // Redirect after success
      setTimeout(() => {
        navigate("/admin/users");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to create user."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar title="Create User" />

      <div className="flex justify-center items-center p-6">
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Create New User
          </h2>

          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 text-green-600 p-3 rounded mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="user">User</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Auto Generate Password */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={autoGeneratePassword}
                onChange={handleAutoGenerate}
              />
              <label className="text-gray-700">
                Auto-generate password
              </label>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Password
              </label>
              <input
                type="text"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={autoGeneratePassword}
                className="w-full border p-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter password"
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/admin/users")}
                className="px-5 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                {loading ? "Creating..." : "Create User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;