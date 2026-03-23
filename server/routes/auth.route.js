const express = require("express");
const router = express.Router();
const { register, login, getMe, logout, updateProfile } = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");

router.post("/register", register);          // POST /api/auth/register  - สมัครสมาชิก
router.post("/login", login);                // POST /api/auth/login     - เข้าสู่ระบบ
router.get("/me", protect, getMe);           // GET  /api/auth/me        - ดึงข้อมูลผู้ใช้ที่ล็อกอิน
router.post("/logout", protect, logout);     // POST /api/auth/logout    - ออกจากระบบ
router.put("/profile", protect, updateProfile); // PUT /api/auth/profile - อัปเดตโปรไฟล์

module.exports = router;
