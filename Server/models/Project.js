const mongoose = require('mongoose');
const { Schema } = mongoose;


// Schemas
const projSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'BugTrack_User',
    required: true
  },
  members: [{  
    type: Schema.Types.ObjectId,
    ref: 'BugTrack_User'
  }],
  tickets: [{ 
    type: Schema.Types.ObjectId,
    ref: 'Ticket'
  }],
  createdAt: { type: Date, default: Date.now }
});

const Project = mongoose.model('Project', projSchema);
module.exports = Project;
