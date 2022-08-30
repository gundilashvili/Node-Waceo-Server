const Transaction = require("../models/Transaction");
const getAddresses = require("../constants/addresses");
 
module.exports =  UpdateTransactionType = async ( Moralis ) => {
    try{ 
        
        // await Transaction.deleteMany({});
        // console.log("Transactions removed"); 
        const dbTransactions =  await Transaction.find({method: null});  
        const records = dbTransactions.slice(0,10); 
        const addresses = getAddresses(43113); 
        if(records.length){
            for(let i of records){
                if(i.transaction_hash){ 
                    const txn = await Moralis.Web3API.native.getTransaction({
                        chain: addresses.ChainId_Hex,
                        transaction_hash: i.transaction_hash,
                    })
                    let _method = "Transfer";
                    
                    if(txn.hasOwnProperty("input")){
                        if(txn.input.toLowerCase().includes("d89527f9") || txn.input.toLowerCase().includes("cc929d68")){
                            _method = "AUTO ALLOCATION MINT";
                        }else if(txn.input.toLowerCase().includes("7dfbc54f") || txn.input.toLowerCase().includes("6263d3bb")){
                            _method = "SHIELDS UP EVENT";
                        }else if(txn.input.toLowerCase().includes("165a1d27") || txn.input.toLowerCase().includes("54b808d2") ){
                            _method = "IDO EVENT";
                        } 
                    }
                    
                    await Transaction.find( { transaction_hash: i.transaction_hash}  ).then(async (record) => { 
                        if (record) { 
                             // Update
                             await Transaction.updateMany(
                              { transaction_hash: i.transaction_hash },
                              { $set:  {  method: _method  } }, 
                              { new: true }
                            ).then(res => { 
                                console.log("Transaction method updated for ", i.transaction_hash);
                                return {success: true};
                            });
                        }  
                    }) 
                }
            }
        }
    }catch(e){
        console.log(e);
    }
}