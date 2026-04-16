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


function App() {
  const appRouter = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
     {
      path: "/admin",
      element: <AdminDashboard />,
    },
     {
      path: "/admin/users",
      element: <AdminUsers />,
    },
     {
      path: "/admin/create-user",
      element: <CreateUser />,
    },
     {
      path: "/user",
      element: <UserDashboard/>
    },
      {
      path: "/manager",
      element: <ManagerDashboard/>
    },
      {
      path: "/manager/users",
      element: <ManagerUsers/>
    }
  ]);

  return (
    <>
      <RouterProvider router={appRouter} />
    </>
  );
}

export default App;
