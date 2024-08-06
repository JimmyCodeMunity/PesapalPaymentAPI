const express = require('express');
const { getToken, registerIPN, handleCallback, submitOrderRequest } = require('../controller/PaymentController');

const router = express.Router();

router.use(express.json())
router.use(express.urlencoded({extended:true}));

//request token
router.post('/requesttoken',getToken)
router.post('/registeripn',registerIPN)
router.get('/callback',handleCallback)
router.post('/requestpayment',submitOrderRequest)

module.exports = router;
