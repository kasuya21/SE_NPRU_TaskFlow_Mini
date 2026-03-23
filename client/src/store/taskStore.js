import { create } from "zustand";
import { createTaskApi, getTasksApi, updateTaskApi, deleteTaskApi } from "../../services/task.service";

const useTaskStore = create((set) => ({
  tasks: [],
  loading: false,
  error: null,

  // ดึงรายการงาน
  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const res = await getTasksApi();
      set({ tasks: res.data.tasks, loading: false });
    } catch (err) {
      set({ loading: false, error: err.response?.data?.message || "เกิดข้อผิดพลาด" });
    }
  },

  // สร้างงานใหม่
  createTask: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await createTaskApi(data);
      set((state) => ({ tasks: [res.data.task, ...state.tasks], loading: false }));
      return res.data;
    } catch (err) {
      set({ loading: false, error: err.response?.data?.message || "เกิดข้อผิดพลาด" });
      throw err;
    }
  },

  // อัปเดตงาน
  updateTask: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const res = await updateTaskApi(id, data);
      set((state) => ({
        tasks: state.tasks.map((t) => (t._id === id ? res.data.task : t)),
        loading: false,
      }));
      return res.data;
    } catch (err) {
      set({ loading: false, error: err.response?.data?.message || "เกิดข้อผิดพลาด" });
      throw err;
    }
  },

  // ลบงาน
  deleteTask: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteTaskApi(id);
      set((state) => ({
        tasks: state.tasks.filter((t) => t._id !== id),
        loading: false,
      }));
    } catch (err) {
      set({ loading: false, error: err.response?.data?.message || "เกิดข้อผิดพลาด" });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useTaskStore;
