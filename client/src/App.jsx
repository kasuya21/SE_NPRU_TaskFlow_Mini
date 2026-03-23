import { BrowserRouter } from "react-router";
import { useEffect } from "react";
import useAuthStore from "./store/authStore";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const { token, fetchMe } = useAuthStore();

  // โหลดข้อมูล user ใหม่ทุกครั้งที่รีเฟรชหน้า ถ้ายังมี token
  useEffect(() => {
    if (token) fetchMe();
  }, [token]);

  return (
    <BrowserRouter>
      <Navbar />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;