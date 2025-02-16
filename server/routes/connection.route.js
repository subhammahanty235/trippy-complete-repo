const express = require('express');
const { createConnection, getAllConnections, getUserDetailsForConnection, createPLConnAndConnect } = require('../controllers/connection.controller');
const { verifyToken } = require('../middleware/tokenVerify');
const router = express.Router();

router.post("/create" ,verifyToken, createConnection);
router.get('/getAll/' ,verifyToken, getAllConnections)
router.post('/getUserForConnection' ,verifyToken, getUserDetailsForConnection);
router.post('/pluser/addConnection',verifyToken, createPLConnAndConnect)

module.exports = router;