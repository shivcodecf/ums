import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* Navbar */}
      <div className="flex justify-between items-center px-8 py-4 bg-white shadow">
        <h1 className="text-xl font-bold text-indigo-600">Ums</h1>
        <div className="space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="text-gray-700 hover:text-indigo-600"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Signup
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center flex-1 text-center px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Manage Users Effortlessly
        </h1>
        <p className="text-gray-600 text-lg mb-6 max-w-xl">
          A powerful user management system for admins and managers to control roles, permissions, and workflows seamlessly.
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/signup")}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
          >
            Get Started
          </button>

          <button
            onClick={() => navigate("/login")}
            className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-100"
          >
            Login
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 text-gray-500 text-sm">
        © 2026 Ums. All rights reserved.
      </div>
    </div>
  );
};

export default Home;