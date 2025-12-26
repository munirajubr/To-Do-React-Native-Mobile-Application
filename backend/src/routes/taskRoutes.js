import express from "express";
import User from "../models/User.js";

const router = express.Router();

/* ================= TASK ROUTES (USERNAME BASED) ================= */

/* --------------------------------------------------
   ADD TASK
   POST /api/tasks
-------------------------------------------------- */
router.post("/", async (req, res) => {
  try {
    const { username, title, description, startDate, deadline } = req.body;

    if (!username || !title || !startDate || !deadline) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.tasks.push({
      title,
      description: description || "",
      startDate: new Date(startDate),
      deadline: new Date(deadline),
      status: "pending",
    });

    await user.save();

    return res.status(201).json({
      message: "Task added successfully",
      tasks: user.tasks,
    });
  } catch (error) {
    console.error("Add task error:", error);
    return res.status(500).json({ message: "Failed to add task" });
  }
});

/* --------------------------------------------------
   GET ALL TASKS (BY USERNAME)
   GET /api/tasks/:username
-------------------------------------------------- */
router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user.tasks);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

/* --------------------------------------------------
   COMPLETE TASK
   PATCH /api/tasks/:username/:taskId/complete
-------------------------------------------------- */
router.patch("/:username/:taskId/complete", async (req, res) => {
  try {
    const { username, taskId } = req.params;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const task = user.tasks.id(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.status = "completed";
    await user.save();

    return res.status(200).json({
      message: "Task marked as completed",
      task,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update task" });
  }
});

/* --------------------------------------------------
   DELETE TASK
   DELETE /api/tasks/:username/:taskId
-------------------------------------------------- */
router.delete("/:username/:taskId", async (req, res) => {
  try {
    const { username, taskId } = req.params;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.tasks = user.tasks.filter(
      (task) => task._id.toString() !== taskId
    );

    await user.save();

    return res.status(200).json({
      message: "Task deleted successfully",
      tasks: user.tasks,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete task" });
  }
});

export default router;
