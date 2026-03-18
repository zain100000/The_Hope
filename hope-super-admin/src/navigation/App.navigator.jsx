/**
 * @file AppNavigator.jsx
 * @module Navigation/Router
 * @description
 * Central routing engine for the application using React Router v6.
 * * **Routing Architecture:**
 * - **Public Access:** Handles entry-level authentication flows (Login, Signup).
 * - **Account Recovery:** Manages the password reset lifecycle (Forgot/Reset).
 * - **Error Handling:** Provides a catch-all fallback for undefined paths.
 * * @requires react-router-dom
 */

import { Routes, Route } from "react-router-dom";

// Outlet
import DashboardLayout from "./outlet/Outlet.outlet";
import ProtectedRoute from "./protected-routes/Protected.route";

// Dashboard
import Main from "../screens/dashboard/Main.dashboard";

// Authentication
import Signin from "../screens/auth/Signin/Signin.auth";
import Signup from "../screens/auth/Signup/Signup.auth";
import ForgotPassword from "../screens/auth/forgot-password/ForgotPassword.auth";
import ResetPassword from "../screens/auth/reset-password/ResetPassword.auth";

// Users Management
import Users from "../screens/manage-users/users/Users";
import UserDetails from "../screens/manage-users/user-details/User.details";

// Yoga Guide Management
import Yoga from "../screens/manage-yoga-guides/yoga-guide/Yoga";
import CreateYoga from "../screens/manage-yoga-guides/create-yoga-guide/CreateYoga";
import YogaGuideDetail from "../screens/manage-yoga-guides/yoga-guide-details/Yoga.guide.details";
import UpdateYogaGuide from "../screens/manage-yoga-guides/update-yoga-guide/UpdateYogaGuide";

// Mental Wellness Articles Management
import Articles from "../screens/manage-articles/articles/Articles";
import AddArticle from "../screens/manage-articles/create-article/AddArticle";
import ArticleDetails from "../screens/manage-articles/article-details/ArticleDetails";
import UpdateArticle from "../screens/manage-articles/update-article/UpdateArticle";

// Not Found
import NotFound from "../screens/not-found/Not-Found";

/**
 * Application routing configuration.
 *
 * @returns {JSX.Element} The route definitions for the app.
 */
const AppNavigator = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<Signin />} />
      <Route path="/auth/signup" element={<Signup />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/reset-password" element={<ResetPassword />} />

      {/* Protected Routes */}
      <Route
        path="/super-admin"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Make dashboard the index route for /super-admin */}
        <Route index element={<Main />} />

        {/* Dashboard Routes */}
        <Route path="" element={<Main />} />

        {/* Users Management */}
        <Route path="users/manage-users" element={<Users />} />
        <Route
          path="users/manage-users/user-details/:userId"
          element={<UserDetails />}
        />

        {/* Yoga Guides Management */}
        <Route path="yoga-guides/manage-guides" element={<Yoga />} />
        <Route
          path="yoga-guides/manage-guides/add-yoga-guide"
          element={<CreateYoga />}
        />
        <Route
          path="yoga-guides/manage-guides/yoga-guide-details/:yogaId"
          element={<YogaGuideDetail />}
        />

        <Route
          path="yoga-guides/manage-guides/update-yoga-guide/:guideId"
          element={<UpdateYogaGuide />}
        />


        {/* Mental Wellness Articles Management */}
        <Route path="articles/manage-articles" element={<Articles />} />
        <Route
          path="articles/manage-articles/add-article"
          element={<AddArticle />}
        />
         <Route
          path="articles/manage-articles/article-details/:articleId"
          element={<ArticleDetails />}
        />

         <Route
          path="articles/manage-articles/update-article/:articleId"
          element={<UpdateArticle />}
        />
      </Route>

      {/* Not Found Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppNavigator;
