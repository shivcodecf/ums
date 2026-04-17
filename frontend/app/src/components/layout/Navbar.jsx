import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import toast from "react-hot-toast";

const Navbar = ({ title }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const API_URL = `${BASE_URL}/api/auth/logout`;

  const handleHomeClick = () => {
    const path = location.pathname; // e.g. "/admin/create"

    const baseRoute = "/" + path.split("/")[1];
    // "/admin/create" → ["", "admin", "create"] → "/admin"

    navigate(baseRoute);
  };

  const handleLogout = async () => {
    localStorage.removeItem("token");

    const res = await axios.post(
      `${API_URL}`,
      {},
      {
        withCredentials: true,
      },
    );

    if (res.data.success) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      toast.success("Logout successfully");
      navigate("/login");
    }
  };

  return (
    <div className="bg-white shadow-md p-4 flex justify-between items-center">
      <div onClick={handleHomeClick} className="cursor-pointer">
        <h1 className="text-xl font-bold text-indigo-600">{title}</h1>
      </div>

      <Button onClick={handleLogout} variant="danger" size="sm">
        Logout
      </Button>
    </div>
  );
};

export default Navbar;
