import { Navigate } from "react-router";
import useAuthStore from "../store/authStore";

// ป้องกัน route ที่ต้อง login ก่อน
const PrivateRoute = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  return token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
