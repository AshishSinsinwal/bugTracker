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
    type: Schema.Types.ObjectId,  
    ref: 'Project',
  },
  status: {
    type: String,
    enum: ["To Do", "In Progress", "Done"],
    default: "To Do" 
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium"
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'BugTrack_User',
  },
   createdBy: { type:Schema.Types.ObjectId, ref: 'BugTrack_User' }, 
  comments: [
    {
      author: {
        type: Schema.Types.ObjectId, 
        ref: 'BugTrack_User', 
        required: true
      },
      message: {
        type: String,
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now 
      }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;