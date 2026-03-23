const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");
require("dotenv").config();

const secret = process.env.SECRET;

// =============================
// @desc    สมัครสมาชิก
// @route   POST /api/auth/register
// @access  Public
// =============================
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. ตรวจสอบว่ากรอกข้อมูลครบไหม
    if (!username || !email || !password) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    // 2. เช็คว่า email หรือ username ซ้ำในระบบไหม
    const existingUser = await UserModel.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "อีเมลหรือชื่อผู้ใช้นี้มีในระบบแล้ว" });
    }

    // 3. เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. สร้างและบันทึกผู้ใช้ใหม่
    const newUser = await UserModel.create({
      username,
      email,
      password: hashedPassword,
    });

    // 5. ส่งผลลัพธ์กลับ (ไม่ส่ง password กลับไป)
    res.status(201).json({
      message: "สมัครสมาชิกสำเร็จ",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์", error: error.message });
  }
};

// =============================
// @desc    เข้าสู่ระบบ
// @route   POST /api/auth/login
// @access  Public
// =============================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. ตรวจสอบว่ากรอกข้อมูลครบไหม
    if (!email || !password) {
      return res.status(400).json({ message: "กรุณากรอกอีเมลและรหัสผ่าน" });
    }

    // 2. ค้นหาผู้ใช้จาก email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
    }

    // 3. เปรียบเทียบรหัสผ่านที่กรอกกับที่เก็บในฐานข้อมูล
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
    }

    // 4. สร้าง JWT Token
    const token = jwt.sign(
      { id: user._id },
      secret,
      { expiresIn: "7d" }
    );

    // 5. ส่ง Token กลับไป (เลือกได้ทั้งแบบ JSON หรือ Cookie)
    res.status(200).json({
      message: "เข้าสู่ระบบสำเร็จ",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์", error: error.message });
  }
};

// =============================
// @desc    ดูโปรไฟล์ตัวเอง (ต้อง Login ก่อน)
// @route   GET /api/auth/me
// @access  Private
// =============================
const getMe = async (req, res) => {
  try {
    // req.user.id มาจาก authMiddleware ที่ถอดรหัส JWT ไว้แล้ว
    const user = await UserModel.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์", error: error.message });
  }
};

// =============================
// @desc    ออกจากระบบ
// @route   POST /api/auth/logout
// @access  Private
// =============================
const logout = (req, res) => {
  // JWT เป็น Stateless → ให้ Frontend ลบ token ทิ้งเอง
  // หากใช้ Cookie-based ให้ clear cookie ออกด้วย
  res.clearCookie("token");
  res.status(200).json({ message: "ออกจากระบบสำเร็จ" });
};

// =============================
// @desc    อัปเดตโปรไฟล์ผู้ใช้
// @route   PUT /api/auth/profile
// @access  Private
// =============================
const updateProfile = async (req, res) => {
  try {
    const { username, email, currentPassword, newPassword, profilePicture } = req.body;

    const user = await UserModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้" });
    }

    // 1. เช็ค username ซ้ำ (ถ้าเปลี่ยน)
    if (username && username !== user.username) {
      const taken = await UserModel.findOne({ username });
      if (taken) {
        return res.status(409).json({ message: "ชื่อผู้ใช้นี้ถูกใช้งานแล้ว" });
      }
      user.username = username;
    }

    // 2. เช็ค email ซ้ำ (ถ้าเปลี่ยน)
    if (email && email !== user.email) {
      const taken = await UserModel.findOne({ email });
      if (taken) {
        return res.status(409).json({ message: "อีเมลนี้ถูกใช้งานแล้ว" });
      }
      user.email = email;
    }

    // 3. เปลี่ยน password (ต้องใส่ currentPassword ยืนยันโดยเสมอ)
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: "กรุณาใส่ currentPassword เพื่อยืนยันตัวตน" });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "currentPassword ไม่ถูกต้อง" });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    // 4. อัปเดต profilePicture
    if (profilePicture !== undefined) {
      user.profilePicture = profilePicture;
    }

    await user.save();

    res.status(200).json({
      message: "อัปเดตโปรไฟล์สำเร็จ",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์", error: error.message });
  }
};

module.exports = { register, login, getMe, logout, updateProfile };

