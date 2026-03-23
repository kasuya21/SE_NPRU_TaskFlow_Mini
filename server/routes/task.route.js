const express = require("express");
const router = express.Router();
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../controllers/task.controller");
const { protect } = require("../middlewares/auth.middleware");

// ทุก route ใน task ต้อง login ก่อน (protect middleware)

router.post("/", protect, createTask);       // POST   /api/tasks      - สร้างงานใหม่
router.get("/", protect, getTasks);          // GET    /api/tasks      - ดึงรายการงานของผู้ใช้ปัจจุบัน
router.put("/:id", protect, updateTask);     // PUT    /api/tasks/:id  - อัปเดตงาน
router.delete("/:id", protect, deleteTask);  // DELETE /api/tasks/:id  - ลบงาน

module.exports = router;
