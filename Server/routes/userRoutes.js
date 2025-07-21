const express = require('express');
const router = express.Router();
const {getDevelopers} = require("../controllers/userController");
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.get('/developers' , verifyToken , requireRole("admin") , getDevelopers);

module.exports = router;