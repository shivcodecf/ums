import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" replace />;
  }

 if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    if (user.role === "manager") {
      return <Navigate to="/manager" replace />;
    }
    if (user.role === "user") {
      return <Navigate to="/user" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
