const Transaction = require("../models/Transaction");
const getAddresses = require("../constants/addresses");
 
module.exports =  UpdateTransactionType = async ( Moralis ) => {
    try{ 
        const dbTransactions =  await Transaction.find({method: null});
        // console.log("dbTransactions", dbTransactions)
        const records = dbTransactions.slice(0,15);
    
        const addresses = getAddresses(43113);
        console.log("total records:", dbTransactions.length)
        if(records.length){
            for(let i of records){
                if(i.transaction_hash){ 
                    const txn = await Moralis.Web3API.native.getTransaction({
                        chain: addresses.ChainId_Hex,
                        transaction_hash: i.transaction_hash,
                    })
                    let _method = "Transfer";
                    if(txn.hasOwnProperty("input")){
                        if(txn.input.toLowerCase().includes("d89527f9")){
                            _method = "AUTO ALLOCATION MINT"
                        }else if(txn.input.toLowerCase().includes("7dfbc54f")){
                            _method = "SHIELDS UP EVENT"
                        }else if(txn.input.toLowerCase().includes("165a1d27")){
                            _method = "IDO EVENT"
                        }
                    }
                    await Transaction.find( { transaction_hash: i.transaction_hash}  ).then(async (record) => { 
                        if (record) { 
                             // Update
                             await Transaction.updateMany(
                              { transaction_hash: i.transaction_hash },
                              { $set:  {method: _method}}, 
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