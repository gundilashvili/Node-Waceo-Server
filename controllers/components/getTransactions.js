 
 
const getAddresses = require("../../constants/addresses");    
const ethers = require('ethers');   
const { commas } = require( "number-prettier");

const getTransactions = async (Moralis) => {  
    try{
         
        const addresses = getAddresses(43113); 
        let transactions = [];
        let items = [];
        let cursor = null;
    
        do {
            const response = await Moralis.Web3API.account.getTokenTransfers({
                chain: addresses.ChainId_Hex,
                address: addresses.Waceo,
                from_block: "0",
                cursor: cursor
            }); 
            cursor = response.cursor;
            items = [...response.result, ...items];

        } while (cursor != "" && cursor != null);
         
        for(let i=0; i< items.length; i++){
            let value = ethers.utils.formatUnits(items[i].value.toString(), 'gwei');
            if(parseFloat(value) >= addresses.Big_Transfers_Amount){
                const formattedValue = commas(parseFloat(value).toFixed(2), 2)
                const d = new Date(items[i].block_timestamp.toString())
                items[i].formattedValue = formattedValue;
                items[i].key = i;
                items[i].date =  d.toDateString() ;
                items[i].txn_url = `${addresses.Block_Explorer}tx/${items[i].transaction_hash}`
                items[i].from_url = `${addresses.Block_Explorer}address/${items[i].from_address}`
                items[i].to_url = `${addresses.Block_Explorer}address/${items[i].to_address}`
                items[i].waceo_url = `${addresses.Block_Explorer}address/${addresses.Waceo}`
                transactions.push(items[i]);
            }
        }   
        return {success: true, transactions };
       
    }catch(e){ 
        console.log(e);
        return{success: false, message: e.message};
    }   
}

module.exports = getTransactions;
