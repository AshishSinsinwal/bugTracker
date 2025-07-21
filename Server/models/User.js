const mongoose = require('mongoose');
const { Schema } = mongoose; // Destructure Schema for cleaner usage

// schema :
const userSchema = new mongoose.Schema({
    name : {
        type : String,
    },
    email : {
        type : String,
    },
    password :{
        type : String,
    },
    role : {
        type :String,
        enum : ['admin' , 'developer'],
    },
    assignedProj : {
        type: Schema.Types.ObjectId,  // Stores a reference ID
        ref: 'Project' 
    }
})

const User = mongoose.model("User" , userSchema);


module.exports = User;

