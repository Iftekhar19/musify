import { Toaster } from "@/components/ui/sonner";
import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./components/Error.tsx";
import { AuthProvider } from "./context/AuthProvider.tsx";
import "./index.css";
import DashboardLayout from "./layouts/DashboardLayout.tsx";
import Albums from "./pages/Albums.tsx";
import AlbumSongs from "./pages/AlbumSongs.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import PlayList from "./pages/PlayList.tsx";
import Profile from "./pages/Profile.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import Signin from "./pages/Signin.tsx";
import Signup from "./pages/Signup.tsx";
import Songs from "./pages/Songs.tsx";
import VerifyAccount from "./pages/VerifyAccount.tsx";
import  AddAlbum from "./pages/AddAlbum.tsx";
import  AddCategory from "./pages/AddCategory.tsx";
import  AddSong from "./pages/AddSong.tsx";
import  Categories from "./pages/Categories.tsx";
import CategorizeAlbum from "./pages/CategorizeAlbum.tsx";

const router = createBrowserRouter([
  // {
  //   path: "/",
  //   element: <App />,
  //   errorElement: <ErrorPage />, // ✅ add errorElement
  // },
  {
    path: "/signin",
    element: <Signin />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/verify-account",
    element: <VerifyAccount />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
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
      // <ProtectedRoute>
      <DashboardLayout />
      //  </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Albums />,
      },
      {
        path: "/album/:id",
        element: <AlbumSongs />,
      },
      {
        path: "/albums/:category",
        element: <CategorizeAlbum />,
      },
      {
        path: "/songs",
        element: <Songs />,
      },
      {
        path: "/playlist",
        element: <PlayList />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/categories",
        element:<Categories/>,
      },
      {
        path: "/category/add",
        element: <AddCategory/>,
      },
      {
        path: "/album/add",
        element: <AddAlbum/>,
      },
      {
        path: "/song/add",
        element: <AddSong/>,
      },
    ],
  },
  // {
  //   element: <AdminDashboardLayout />,
  //   errorElement: <ErrorPage />,
  //   children: [
  //     // {
  //     //   path: "/admin-dashboard",
  //     //   element: <Dashboard />,
  //     // },
  //     {
  //       path: "/admin-dashboard/category",
  //       element: <Dashboard />,
  //     },
  //     {
  //       path: "/admin-dashboard/add/category",
  //       element: <Dashboard />,
  //     },
  //     {
  //       path: "/admin-dashboard/albums",
  //       element: <Albums />,
  //     },
  //     {
  //       path: "/admin-dashboard/albums/:id",
  //       element: <AlbumSongs />,
  //     },
  //     {
  //       path: "/admin-dashboard/add/album",
  //       element: <Dashboard />,
  //     },
  //     {
  //       path: "/admin-dashboard/songs",
  //       element: <Songs />,
  //     },
  //     {
  //       path: "/admin-dashboard/add/song",
  //       element: <Dashboard />,
  //     },
  //   ],
  // },
]);
createRoot(document.getElementById("root")!).render(
  <React.Fragment>
    <Toaster />
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.Fragment>
);
