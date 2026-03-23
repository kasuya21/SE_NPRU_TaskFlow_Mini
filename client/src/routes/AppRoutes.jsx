import { Routes, Route, Navigate } from "react-router";
import PrivateRoute from "./PrivateRoute";

import HomePage    from "../pages/HomePage";
import LoginPage    from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import TaskPage     from "../pages/TaskPage";
import ProfilePage  from "../pages/ProfilePage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/"         element={<HomePage />} />
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Private routes */}
      <Route path="/tasks"   element={<PrivateRoute><TaskPage /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
