const { getUserUsingToken, editUserProfile } = require('../controllers/user.controller');
const { verifyToken } = require('../middleware/tokenVerify');

const router = require('express').Router();

router.get('/get/usingtoken',verifyToken, getUserUsingToken);
router.post('/update/usingtoken', verifyToken , editUserProfile);

module.exports = router