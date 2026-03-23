import api from "./api";

export const createTaskApi = (data)        => api.post("/tasks", data);
export const getTasksApi   = ()            => api.get("/tasks");
export const updateTaskApi = (id, data)    => api.put(`/tasks/${id}`, data);
export const deleteTaskApi = (id)          => api.delete(`/tasks/${id}`);
