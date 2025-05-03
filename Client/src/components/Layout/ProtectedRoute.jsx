import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"; // Ensure this path is correct

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth(); // user: { role, token, etc. }

  // If no user is logged in, redirect to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If the user's role is not allowed, redirect to the unauthorized page
  if (!allowedRoles?.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If the user is authorized, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;