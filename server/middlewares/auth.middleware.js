const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");
require("dotenv").config();

const secret = process.env.SECRET;

// =============================
// Middleware: ตรวจสอบ JWT Token
// ใช้กับทุก Route ที่ต้องการ Login ก่อน
// =============================
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. เช็คว่ามี Token ส่งมาไหม (format: "Bearer <token>")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "ไม่มี Token กรุณาเข้าสู่ระบบก่อน" });
    }

    // 2. แยกเอาเฉพาะ Token ออกมา (ตัด "Bearer " ออก)
    const token = authHeader.split(" ")[1];

    // 3. ตรวจสอบและถอดรหัส Token
    const decoded = jwt.verify(token, secret);

    // 4. ค้นหา User จาก id ใน Token (ไม่ดึง password มา)
    const user = await UserModel.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "ไม่พบผู้ใช้ Token ไม่ถูกต้อง" });
    }

    // 5. ยัด user เข้า req เพื่อให้ Controller ถัดไปใช้ได้
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token หมดอายุ กรุณาเข้าสู่ระบบใหม่" });
    }
    return res.status(401).json({ message: "Token ไม่ถูกต้อง", error: error.message });
  }
};

module.exports = { protect };
