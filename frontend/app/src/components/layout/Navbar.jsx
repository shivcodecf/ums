import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = ({ title }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleHomeClick = () => {
    const path = location.pathname; // e.g. "/admin/create"

    const baseRoute = "/" + path.split("/")[1];
    // "/admin/create" → ["", "admin", "create"] → "/admin"

    navigate(baseRoute);
  };

  const handleLogout = async () => {
    localStorage.removeItem("token");

    const res = await axios.post(
      `http://localhost:1080/api/auth/logout`,
      {},
      {
        withCredentials: true,
      },
    );

    if (res.data.success) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      alert("logout successfully");
      navigate("/login");
    }
  };

  return (
    <div className="bg-white shadow-md p-4 flex justify-between items-center">
      <div onClick={handleHomeClick} className="cursor-pointer">
        <h1 className="text-xl font-bold text-indigo-600">{title}</h1>
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded-lg"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
