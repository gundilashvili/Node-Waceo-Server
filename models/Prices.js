const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const PricesSchema = new Schema({

    waceo_price_in_usd: {
        type: String,
        default: ''
    },
    waceo_price_in_eur: {
        type: String,
        default: ''
    },
    waceo_price_in_avax: {
        type: String,
        default: ''
    },
    waceo_total_supply: {
        type: String,
        default: ''
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
module.exports = Prices = mongoose.model('Prices', PricesSchema)