import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import ErrorPage from "./components/Error.tsx";
import "./index.css";
import AdminDashboardLayout from "./layouts/AdminDashboardLayout.tsx";
import DashboardLayout from "./layouts/DashboardLayout.tsx";
import Albums from "./pages/Albums.tsx";
import AlbumSongs from "./pages/AlbumSongs.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import PlayList from "./pages/PlayList.tsx";
import Profile from "./pages/Profile.tsx";
import Signin from "./pages/Signin.tsx";
import Signup from "./pages/Signup.tsx";
import Songs from "./pages/Songs.tsx";
import { AuthProvider } from "./context/AuthProvider.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import { Toaster } from "@/components/ui/sonner"
import React from "react";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />, // ✅ add errorElement
  },
  {
    path: "/signin",
    element: (
     
        <Signin />
 
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/signup",
    element: (
      <>
        <Signup />
      </>
    ),
    errorElement: <ErrorPage />,
  },
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/dashboard",
        element: <Albums />,
      },
      {
        path: "/dashboard/albums/:id",
        element: <AlbumSongs />,
      },
      {
        path: "/dashboard/songs",
        element: <Songs />,
      },
      {
        path: "/dashboard/playlist",
        element: <PlayList />,
      },
      {
        path: "/dashboard/profile",
        element: <Profile />,
      },
    ],
  },
  {
    element: <AdminDashboardLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/admin-dashboard",
        element: <Dashboard />,
      },
    ],
  },
]);
createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  //   <App />
  // </StrictMode>,
  <React.Fragment>
  <Toaster/>
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
  </React.Fragment>
);
