// routes/projectRoutes.js
const express = require("express");
const router = express.Router();
const { createProject, getMyProjects , getSingleProject , deleteProject } = require("../controllers/projectController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

router.post("/create", verifyToken, requireRole("admin"), createProject);
router.get("/my-projects", verifyToken, requireRole("admin"), getMyProjects);
router.get("/:id", verifyToken, getSingleProject);
router.delete("/:id" , verifyToken , requireRole("admin") , deleteProject);

module.exports = router;
