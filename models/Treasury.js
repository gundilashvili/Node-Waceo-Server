const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const TreasurySchema = new Schema({

    total_market_value: {
        type: String,
        default: ''
    },
    tokens: {
        type: Array,
        default: []
    }, 
    create_time : {
        type: String,
        default: Date.now
    },
    create_date: {
        type: String,
        default: Date.now
    }
}) 
module.exports = Treasury = mongoose.model('Treasury', TreasurySchema)