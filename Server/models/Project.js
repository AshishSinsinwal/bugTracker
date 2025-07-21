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
    ref: 'User',
    required: true
  },
  members: [{  // Changed to array of User references
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  tickets: [{  // Changed to array of Ticket references
    type: Schema.Types.ObjectId,
    ref: 'Ticket'
  }],
  createdAt: { type: Date, default: Date.now }
});

const Project = mongoose.model('Project', projSchema);
module.exports = Project;
