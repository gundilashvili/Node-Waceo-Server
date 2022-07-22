const getTreasury = require("./components/getTreasury"); 
const Treasury = require("../models/Treasury");

module.exports =  UpdateTreasury = async ( Moralis ) => {
    try{ 
        const response = await getTreasury(Moralis); 
        if(response.success){
            if(response.total && response.data){

                const newDate = new Date();
                const time = newDate.getHours().toString() + ':' + newDate.getMinutes().toString()
                const date = newDate.toLocaleString().split(',')[0]; 
    
                const dataFields = {
                    total_market_value: response.total,
                    tokens: response.data,
                    create_time: time,
                    create_date: date
                }    
                // DB updates
                Treasury.findOne( { create_date: date}  ).then(record => { 
                    if (record) {
                         // Update
                         Treasury.findOneAndUpdate(
                          { create_date: date },
                          { $set: dataFields }, 
                          { new: true }
                        ).then(res => {
                            console.log("WACEO treasury - record successfully updated: ", res);
                            return {success: true};
                        });
                    } else {
                        // Create
                        new Treasury(dataFields).save().then(() => {
                            console.log("WACEO treasury - record successfully updated: ", dataFields);
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