const getFunds = require("./components/getFunds"); 
const Funds = require("../models/Funds");

module.exports =  UpdateFunds = async ( Moralis ) => {
    try{ 
        const response = await getFunds(Moralis); 
        if(response.success){
            if(response.data && response.total){
                const newDate = new Date();
                const time = newDate.getHours().toString() + ':' + newDate.getMinutes().toString();
                const date = newDate.toLocaleString().split(',')[0]; 

                const dataFields = {
                    total_waceo_amount: response.total,
                    funds: response.data,
                    create_time: time,
                    create_date: date
                };

                // DB updates
                Funds.findOne( { create_date: date}  ).then(record => { 
                    if (record) {
                         // Update
                         Funds.findOneAndUpdate(
                          { create_date: date },
                          { $set: dataFields }, 
                          { new: true }
                        ).then(res => {
                            console.log("WACEO funds - record successfully updated: ", res);
                            return {success: true};
                        });
                    } else {
                        // Create
                        new Funds(dataFields).save().then(() => {
                            console.log("WACEO funds - record successfully created", dataFields);
                            return {success: true};
                        })  
                    }
                })
            } 
        } 
    }catch(e){
        console.log(e);
    }
}