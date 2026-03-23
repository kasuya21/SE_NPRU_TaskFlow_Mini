import { create } from "zustand";
import { loginApi, logoutApi, getMeApi, registerApi, updateProfileApi } from "../../services/auth.service";

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,

  // สมัครสมาชิก
  register: async (data) => {
    set({ loading: true, error: null });
    try {
      await new Promise(r => setTimeout(r, 600)); // เพิ่ม delay
      const res = await registerApi(data);
      set({ loading: false });
      return res.data;
    } catch (err) {
      set({ loading: false, error: err.response?.data?.message || "เกิดข้อผิดพลาด" });
      throw err;
    }
  },

  // เข้าสู่ระบบ
  login: async (data) => {
    set({ loading: true, error: null });
    try {
      await new Promise(r => setTimeout(r, 600)); // เพิ่ม delay เล็กน้อยให้ดูเป็นธรรมชาติ
      const res = await loginApi(data);
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      set({ user, token, loading: false });
      return res.data;
    } catch (err) {
      set({ loading: false, error: err.response?.data?.message || "เกิดข้อผิดพลาด" });
      throw err;
    }
  },

  // ออกจากระบบ
  logout: async () => {
    try { await logoutApi(); } catch (_) {}
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },

  // ดึงข้อมูล user ปัจจุบัน
  fetchMe: async () => {
    try {
      const res = await getMeApi();
      set({ user: res.data.user });
    } catch (_) {
      set({ user: null });
    }
  },

  // อัปเดตโปรไฟล์
  updateProfile: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await updateProfileApi(data);
      set({ user: res.data.user, loading: false });
      return res.data;
    } catch (err) {
      set({ loading: false, error: err.response?.data?.message || "เกิดข้อผิดพลาด" });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
