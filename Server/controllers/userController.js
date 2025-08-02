const BugTrack_User = require('../models/User');

exports.getDevelopers = async (req ,res) => {
    try{
        const users = await BugTrack_User.find({role : "developer"});
        if(users){
            console.log(users);
           res.json({users});
        }else {
            res.status(400).json({message: "No developer found" , error : err.message})
        }
    }catch(err){
        res.status(400).json({message: "Error in finding developers" , error : err.message})
    }
}