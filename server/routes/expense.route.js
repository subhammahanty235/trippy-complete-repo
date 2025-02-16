const express = require('express');
const { addNewExpense, getTotalTripExpense, fetchAllLendingsOfUserTripBased } = require('../controllers/expense.controller');
const { verifyToken } = require('../middleware/tokenVerify');
const getAllStatsOfUser = require('../controllers/stats.controller');
const router = express.Router();

router.post('/addExpense' , verifyToken,addNewExpense)
router.post('/getTotalExpense/:tripCode' ,verifyToken, getTotalTripExpense)
router.get('/gettriplending/:tripId' , verifyToken , fetchAllLendingsOfUserTripBased)
router.get('/stats', verifyToken, getAllStatsOfUser)
module.exports = router;