const express = require("express");
const app = express();
const cors = require("cors");
const port = 8000;
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const authRouter = require("./routes/authRoutes");
const ticketRoutes = require('./routes/ticketRoutes');
const projectRoutes = require("./routes/projectRoutes");
const userRoutes = require("./routes/userRoutes");


app.use(express.json());
app.use(cors());
app.use('/api/auth' , authRouter);
app.get("/" , (req , res)=>{
    res.send("u are in root");
})
app.use("/api/projects", projectRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/users' , userRoutes);
const mongoURI = process.env.ATLAS_DB || 'mongodb://127.0.0.1:27017/bugTracker'; 
mongoose.connect(mongoURI)
  .then(() => app.listen(port, () => console.log('Server running on port 8000')))
  .catch(err => console.error(err));