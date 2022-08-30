const getTransactions = require("./components/getTransactions");   
const Transaction = require("../models/Transaction");

module.exports =  UpdatePrices = async ( Moralis ) => {
    try{ 
        console.log("Updating transactions...");
        const response = await getTransactions(Moralis); 
        if(response.success){
            if(response.transactions){  
                
               // Get transactions from database
               const dbTransactions = await  Transaction.find(); 
               let newTransactions = [];
               for(let i of response.transactions){
                    let exists = false;
                    for(let b of dbTransactions){
                        if(b.transaction_hash == i.transaction_hash){
                            exists = true;
                        }
                    }
                    if(!exists){
                        newTransactions.push(i)
                    }
               }  
                
                // Insert latest data
                Transaction.collection.insertMany(newTransactions,   (err, docs) => {
                    if (err){  
                        return {success: false};
                    } else {
                    console.log(`WACEO transactions - records successfully added (${newTransactions.length})`);
                        return {success: true};
                    }
                }) 
            }
           
        } 
    }catch(e){
        console.log(e);
    }
}