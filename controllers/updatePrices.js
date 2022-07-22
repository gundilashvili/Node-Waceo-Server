
const getPrices = require("./components/getPrices");
const Prices = require("../models/Prices");

module.exports =  UpdatePrices = async ( Moralis ) => {
    try{ 
        const response = await getPrices(Moralis); 
        if(response.success){

            const newDate = new Date();
            const time = newDate.getHours().toString() + ':' + newDate.getMinutes().toString();
            const date = newDate.toLocaleString().split(',')[0]; 

            const dataFields = {
                waceo_price_in_usd: response.prices.waceoPriceInUsd,
                waceo_price_in_eur: response.prices.waceoPriceInEur,
                waceo_price_in_avax: response.prices.waceoPriceInAvax,
                waceo_total_supply: response.prices.waceoTotalSupply,
                create_time: time,
                create_date: date
            }
             // DB updates
            Prices.findOne( { create_date: date}  ).then(record => { 
                if (record) {
                     // Update
                     Prices.findOneAndUpdate(
                      { create_date: date },
                      { $set: dataFields }, 
                      { new: true }
                    ).then(res => {
                        console.log("WACEO prices - record successfully updated: ", res);
                        return {success: true};
                    });
                } else {
                    // Create
                    new Prices(dataFields).save().then(() => {
                        console.log("WACEO prices - record successfully created", dataFields);
                        return {success: true};
                    });
                }
            })
        } 
    }catch(e){
        console.log(e);
    }
}