// controllers/projectController.js
const { default: mongoose } = require("mongoose");
const Project = require("../models/Project");
const BugTrack_User = require("../models/User");

// Create a new project (Admin only)
exports.createProject = async (req, res) => {
  try {
    console.log("inside");
    const { name, description, members } = req.body;

    // === VALIDATION CHECKS ===
    if (!name || !description) {
      return res.status(400).json({ message: "Name and description are required" });
    }

    if (name.length < 3 || name.length > 100) {
      return res.status(400).json({ message: "Name must be 3-100 characters" });
    }

    if (description.length > 1000) {
      return res.status(400).json({ message: "Description too long (max 1000 chars)" });
    }

    const newProject = new Project({
      name,
      description,
      createdBy: req.user.id,
      members: members || [] 
    });

    await newProject.save();

    res.status(201).json({ message: "Project created", project: newProject });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all projects created by this admin
exports.getMyProjects = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const projects = await Project.find({ createdBy: req.user.id }).populate("members", "name email role");
    res.status(200).json({ projects });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


exports.getSingleProject = async (req, res) => {
try {
   if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }
    const project = await Project.findById(req.params.id)
      .populate({
        path: "tickets",
        populate: [
          { path: "createdBy", select: "name" },
          { path: "comments.author", select: "name role" },
          { path: "assignedTo", select: "name email" }
        ]
      });
      
    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json({ project });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }
    const projectId = req.params.id;

    await Project.findByIdAndDelete(projectId);
    res.status(200).json({ message: "Project deleted successfully" });
  } catch(err) {
    res.status(500).json({ 
      message: "Server error", 
      error: err.message 
    });
  }
}