const Ticket = require('../models/Ticket');
const Project = require('../models/Project');
const User = require("../models/User");

// Admin: create a ticket
exports.createTicket = async (req, res) => {
  try {
    const { title, description, priority, assignedTo } = req.body;
    const { projectId } = req.params;

    // === VALIDATIONS ===
    // 1. Required fields
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    // 2. Validate title length (3-100 chars)
    if (title.length < 3 || title.length > 100) {
      return res.status(400).json({ message: "Title must be 3-100 characters" });
    }

    // 3. Validate priority (enum)
    const validPriorities = ["Low", "Medium", "High"];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({ message: "Invalid priority level" });
    }

    const newTicket = new Ticket({
      title: title.trim(),
      description: description.trim(),
      priority : priority || "Medium",
      project: projectId,
      assignedTo,
      createdBy: req.user.id
    })
    
    await newTicket.save();

    let project = await Project.findByIdAndUpdate(projectId , {$push : {tickets : newTicket._id}});

    res.status(201).json({ message: 'Ticket created', ticket: newTicket });
  } catch (err) {
    res.status(500).json({ message: 'Error creating ticket', error: err.message });
  }
};

// Get all tickets for a project (visible to all members)
exports.getTicketsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
     if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const tickets = await Ticket.find({ project: projectId })
      .populate("createdBy" , "name")
      .populate("comments.author" , "name role")
      .populate('assignedTo', 'name email')
      .populate('project', 'name description')
      .sort({ createdAt: -1 });

    res.json({ tickets });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tickets', error: err.message });
  }
};

// Developer: update status
exports.updateTicketStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;

    const validStatuses = ["To Do", "In Progress", "Done"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updated = await Ticket.findByIdAndUpdate(ticketId, { status }, { new: true })
       .populate('comments.author', 'name email')
    res.json({ message: 'Status updated', ticket: updated });
  } catch (err) {
    res.status(500).json({ message: 'Error updating status', error: err.message });
  }
};

// Add comment
exports.addComment = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { message } = req.body;

   if (!message || message.trim().length < 1) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const ticket = await Ticket.findByIdAndUpdate(
      ticketId,
      {
        $push: {
          comments: {
            author: req.user.id,
            message
          }
        }
      },
      { new: true } // Return the updated document
    )
    .populate("createdBy", "name")
    .populate("comments.author", "name role")
    .populate('assignedTo', 'name email')
    .populate('project', 'name description')

    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    res.json({ message: 'Comment added', ticket });
  } catch (err) {
    res.status(500).json({ message: 'Error adding comment', error: err.message });
  }
};


exports.getTicketsByDeveloper = async (req, res) => {
  try {
    const tickets = await Ticket.find({ assignedTo: req.user.id })
    .populate('project')
    .populate('comments.author' , 'name role')
    .populate('project', 'name description')
    res.json({ tickets });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.assignDeveloper = async (req, res) => {
  const { ticketId } = req.params;
  const { developerId } = req.body;

  try {

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return res.status(400).json({ message: "Invalid ticket ID" });
    }

    const user = await User.findById(developerId);
    if (!user || user.role !== "developer") {
      return res.status(400).json({ message: "Invalid developer ID" });
    }

    const ticket = await Ticket.findByIdAndUpdate(
      ticketId,
      { assignedTo: developerId },
      { new: true }
    ).populate("assignedTo", "name email");

    res.json({ ticket });
  } catch (err) {
    res.status(500).json({ message: "Failed to assign developer", error: err.message });
  }
};


exports.deleteTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const deletedTicket = await Ticket.findByIdAndDelete(ticketId);
    
    if (!deletedTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    
    res.json({ 
      message: "Ticket deleted successfully",
      ticket: deletedTicket 
    });
  } catch (err) {
    console.error("Delete ticket error:", err);
    res.status(500).json({ 
      message: "Failed to delete ticket", 
      error: err.message 
    });
  }
};



