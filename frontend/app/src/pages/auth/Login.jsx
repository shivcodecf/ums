import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:1080/api/auth/login`,
        form,
        {
          withCredentials: true,
        },
      );

      localStorage.setItem("token", res.data.token);
      alert("Login Successful!");
      // window.location.href = "/dashboard";

      if (res.data.user.role == "admin") {
        navigate("/admin");
      } else if (res.data.user.role == "manager") {
        navigate("/manager");
      } else {
        navigate("/user");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 text-white items-center justify-center p-10">
        <div>
          <h1 className="text-4xl font-bold mb-4">User Management System</h1>
          <p className="text-lg opacity-90">
            Securely manage users, roles, and permissions with ease.
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Welcome Back
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Login to your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              onChange={handleChange}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-200"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-4">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-600 font-medium hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
