import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { name, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const API_URL = `${BASE_URL}/api/auth/register`;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.post(`${API_URL}`, {
        name,
        email,
        password,
      });

      toast.success("signup successfully!");
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Signup failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 text-white items-center justify-center p-12">
        <div>
          <h1 className="text-4xl font-bold mb-4">Join Our Platform 🚀</h1>
          <p className="text-lg opacity-90">
            Create an account to manage users, roles, and permissions securely
            and efficiently.
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Create an Account
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Get started with your free account
          </p>

          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={name}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={email}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />

            <Button
              type="submit"
              loading={loading}
              loadingText="Creating Account..."
              fullWidth
            >
              Sign Up
            </Button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
