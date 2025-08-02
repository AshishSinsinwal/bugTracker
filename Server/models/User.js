const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        enum: ['admin', 'developer'],
    },
    assignedProj: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
    }
});

const BugTrack_User = mongoose.model("BugTrack_User", userSchema);

module.exports = BugTrack_User;
