const mongoose = require('mongoose');
const { Schema } = mongoose; // Destructure Schema for cleaner usage


// Schema:
const ticketSchema = new Schema({
  title: {
    type :String,
    require : true
  },
  description: String,
  project: {
    type: Schema.Types.ObjectId,  // Use Schema.Types.ObjectId (not mongoose.Schema...)
    ref: 'Project',
  },
  status: {
    type: String,
    enum: ["To Do", "In Progress", "Done"],
    default: "To Do"  // Optional: Set a default value
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium"  // Optional: Set a default value
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
   createdBy: { type:Schema.Types.ObjectId, ref: 'User' }, // admin
  comments: [
    {
      author: {
        type: Schema.Types.ObjectId,  // Fixed: Use Schema.Types.ObjectId (not just `ObjectId`)
        ref: 'User',  // Assuming comments are made by users
        required: true
      },
      message: {
        type: String,
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now  // Auto-set to current time
      }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;