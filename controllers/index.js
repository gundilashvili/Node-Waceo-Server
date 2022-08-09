const Moralis = require("moralis/node");
const UpdatePrices = require("./updatePrices");
const UpdateFunds = require("./updateFunds");
const UpdateTreasury = require("./updateTreasury");
const UpdateTransactions = require("./updateTransactions");
const UpdateTransactionType = require("./updateTransactionType");

const setData = async () => {
    try{ 
        await UpdatePrices(Moralis); 
        await UpdateFunds(Moralis); 
        setTimeout(() => {
            UpdateTreasury(Moralis); 
        }, 61000);
        setTimeout(() => {
            UpdateTransactions(Moralis); 
        }, 130000);
        setTimeout(() => {
            UpdateTransactionType(Moralis);
        }, 200000);
       
    }catch(e){
        console.log(e);
    }
}


const looper =  () => {
    setData();
    setTimeout(() => {
        looper();
    }, 400000);
}

 

const initialize = async () => {
    try{  
        const serverUrl = process.env.serverUrl;
        const appId = process.env.appId;
        const masterKey = process.env.masterKey;

        await Moralis.start({ serverUrl, appId, masterKey });
        looper(); 

    }catch(e){
        console.log(e);
    }
}

module.exports = initialize;