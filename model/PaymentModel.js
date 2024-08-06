const mongoose = require('mongoose');
const paymentSchema = new mongoose.Schema({
    payingphone:{
        type: String
    },
    amount:{
        type: Number
    }
})

const Payment = mongoose.model('Payment',paymentSchema);
module.exports = Payment;