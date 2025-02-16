const { addPaymentMethodOfUser, getPaymentMethodsOfSelectedUser } = require('../controllers/payment.controller')
const { verifyToken } = require('../middleware/tokenVerify')

const router = require('express').Router()

router.post('/methods/add', verifyToken , addPaymentMethodOfUser)
router.get('/methods/get/:userId' , verifyToken , getPaymentMethodsOfSelectedUser);

module.exports = router