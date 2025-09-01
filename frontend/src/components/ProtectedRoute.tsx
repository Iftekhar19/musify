import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
interface RouteChildren{
    children:ReactNode
}
const ProtectedRoute = ({children}:RouteChildren) => {
  const location = useLocation();
  const authUser = localStorage.getItem("authUser");

  if (!authUser) {
    // Redirect to signin and keep track of where user was going
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If logged in, render the route content
  return <>
  {children}
  </>
};

export default ProtectedRoute;
