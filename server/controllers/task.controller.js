const TaskModel = require("../models/Task");

// =============================
// @desc    สร้างงานใหม่
// @route   POST /api/tasks
// @access  Private
// =============================
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    // 1. ตรวจสอบ field ที่จำเป็น
    if (!title || !description || !dueDate) {
      return res
        .status(400)
        .json({ message: "กรุณากรอก title, description และ dueDate" });
    }

    // 2. สร้างงานใหม่ โดยผูก assignee กับ user ที่ล็อกอินอยู่
    const task = await TaskModel.create({
      title,
      description,
      status,
      priority,
      dueDate,
      assignee: req.user._id, // มาจาก protect middleware
    });

    res.status(201).json({ message: "สร้างงานสำเร็จ", task });
  } catch (error) {
    res
      .status(500)
      .json({ message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์", error: error.message });
  }
};

// =============================
// @desc    ดึงรายการงานของผู้ใช้ปัจจุบัน
// @route   GET /api/tasks
// @access  Private
// =============================
const getTasks = async (req, res) => {
  try {
    // Filter เฉพาะงานที่ assignee เป็น user คนที่ล็อกอินอยู่
    const tasks = await TaskModel.find({ assignee: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({ count: tasks.length, tasks });
  } catch (error) {
    res
      .status(500)
      .json({ message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์", error: error.message });
  }
};

// =============================
// @desc    อัปเดตงาน (title, status, priority, ฯลฯ)
// @route   PUT /api/tasks/:id
// @access  Private
// =============================
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. ค้นหางานและตรวจสอบว่าเป็นของ user คนนี้ไหม
    const task = await TaskModel.findOne({ _id: id, assignee: req.user._id });
    if (!task) {
      return res
        .status(404)
        .json({ message: "ไม่พบงาน หรือคุณไม่มีสิทธิ์แก้ไขงานนี้" });
    }

    // 2. อัปเดตข้อมูลที่ส่งมาเท่านั้น และอัปเดต updatedAt
    const allowedFields = ["title", "description", "status", "priority", "dueDate"];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    });
    task.updatedAt = Date.now();

    await task.save();

    res.status(200).json({ message: "อัปเดตงานสำเร็จ", task });
  } catch (error) {
    res
      .status(500)
      .json({ message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์", error: error.message });
  }
};

// =============================
// @desc    ลบงาน
// @route   DELETE /api/tasks/:id
// @access  Private
// =============================
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // ค้นหาและลบเฉพาะงานที่เป็นของ user คนนี้
    const task = await TaskModel.findOneAndDelete({
      _id: id,
      assignee: req.user._id,
    });

    if (!task) {
      return res
        .status(404)
        .json({ message: "ไม่พบงาน หรือคุณไม่มีสิทธิ์ลบงานนี้" });
    }

    res.status(200).json({ message: "ลบงานสำเร็จ" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์", error: error.message });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
