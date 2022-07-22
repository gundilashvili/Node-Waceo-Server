const getTransactions = require("./components/getTransactions");   
const Transaction = require("../models/Transaction");

module.exports =  UpdatePrices = async ( Moralis ) => {
    try{ 
        const response = await getTransactions(Moralis); 
        if(response.success){
            if(response.transactions){  
                
                // Clear old data
                await Transaction.deleteMany({}, function (err) {
                    if (err) return {success: false, message: err.message};
                    console.log("WACEO transactions - removed old transactions");
                });
                
                // Insert latest data
                Transaction.collection.insertMany(response.transactions,   (err, docs) => {
                    if (err){  
                        return {success: false};
                    } else {
                    console.log(`WACEO transactions - records successfully added (${response.transactions.length})`);
                        return {success: true};
                    }
                }) 
            }
           
        } 
    }catch(e){
        console.log(e);
    }
}