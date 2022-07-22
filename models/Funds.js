const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const FundsSchema = new Schema({

    total_waceo_amount: {
        type: String,
        default: ''
    },
    funds: {
        type: Array,
        default: []
    },
    create_time : {
        type: String,
        default: Date.now
    },
    create_date: {
        type: String,
    }
}) 
module.exports = Funds = mongoose.model('Funds', FundsSchema)