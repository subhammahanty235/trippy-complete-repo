const express = require('express');
const { createNewTrip, getTripByIdWithUsers, getLiveTripOfUser, tripJoinRequest, acceptTripJoinRequest, rejectTripJoinRequest, addConnectionToTrip, getAllTripsOfUser } = require('../controllers/trip.controller');
const { verifyToken } = require('../middleware/tokenVerify');
const router = express.Router();

router.post('/create' ,verifyToken, createNewTrip);
router.post('/getByIdWithUsers',verifyToken, getTripByIdWithUsers);
router.get('/livetrip/user' ,verifyToken, getLiveTripOfUser)
router.post('/request/create', verifyToken, tripJoinRequest)
router.post('/request/accept/:reqid', verifyToken, acceptTripJoinRequest)
router.post('/request/reject/:reqid', verifyToken, rejectTripJoinRequest)   
router.post('/add/user' , verifyToken, addConnectionToTrip)
router.get('/alltrips', verifyToken, getAllTripsOfUser)
module.exports = router;