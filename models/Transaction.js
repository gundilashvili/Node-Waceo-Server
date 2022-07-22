const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const TransactionsSchema = new Schema({ 
    transaction_hash : {
        type: String,
        default: ''
    },
    address : {
        type: String,
        default: ''
    },
    block_number : {
        type: String,
        default: ''
    },
    to_address : {
        type: String,
        default: ''
    },
    from_address : {
        type: String,
        default: ''
    },
    value : {
        type: String,
        default: ''
    },
    formattedValue : {
        type: String,
        default: ''
    },
    key : {
        type: String,
        default: ''
    },
    txn_url : {
        type: String,
        default: ''
    },
    from_url : {
        type: String,
        default: ''
    },
    to_url : {
        type: String,
        default: ''
    },
    waceo_url : {
        type: String,
        default: ''
    },
    date: {
        type: String,
        default: ''
    },
}) 
module.exports = Transactions = mongoose.model('Transactions', TransactionsSchema)