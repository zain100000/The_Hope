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

// Authentication
import Signin from "../screens/auth/Signin/Signin.auth";
import Signup from "../screens/auth/Signup/Signup.auth";
import ForgotPassword from "../screens/auth/forgot-password/ForgotPassword.auth";
import ResetPassword from "../screens/auth/reset-password/ResetPassword.auth";

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

      {/* Not Found Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppNavigator;
