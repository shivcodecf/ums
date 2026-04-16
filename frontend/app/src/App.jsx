import "./App.css";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import CreateUser from "./pages/admin/CreateUser";
import UserDashboard from "./pages/dashboards/UserDashboard";
import ManagerDashboard from "./pages/dashboards/ManagerDashboard";
import ManagerUsers from "./pages/manager/ManagerUsers";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";

function App() {
  const appRouter = createBrowserRouter([
    // 🔓 Public Routes
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },

    {
  path: "/",
  element: <Home />,
}

    // 🔐 Admin Routes
    {
      path: "/admin",
      element: (
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminDashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/users",
      element: (
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminUsers />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/create-user",
      element: (
        <ProtectedRoute allowedRoles={["admin"]}>
          <CreateUser />
        </ProtectedRoute>
      ),
    },

    // 🔐 User Routes
    {
      path: "/user",
      element: (
        <ProtectedRoute allowedRoles={["user"]}>
          <UserDashboard />
        </ProtectedRoute>
      ),
    },

    // 🔐 Manager Routes
    {
      path: "/manager",
      element: (
        <ProtectedRoute allowedRoles={["manager"]}>
          <ManagerDashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "/manager/users",
      element: (
        <ProtectedRoute allowedRoles={["manager"]}>
          <ManagerUsers />
        </ProtectedRoute>
      ),
    },
  ]);

  return (
    <>
      <RouterProvider router={appRouter} />
    </>
  );
}

export default App;
