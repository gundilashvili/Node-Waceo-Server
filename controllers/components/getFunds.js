 
const getAddresses = require("../../constants/addresses");  
const { commas } = require( 'number-prettier');
const ethers = require("ethers");     

const getFunds = async ( Moralis ) => { 
    try{
       
        const _addresses = getAddresses(43113); 
        let responseArr = [];
        let total = 0;
        
        for(let i of _addresses.Waceo_Funds){ 
            const balances = await Moralis.Web3API.account.getTokenBalances({
                chain: _addresses.ChainId_Hex,
                address: i.address.toString()
            }); 
            for(let b of balances){
                if(b.token_address.toLowerCase() == _addresses.Waceo.toLowerCase()){ 
                    const formattedBalance = parseInt(ethers.utils.formatUnits(b.balance.toString(),'gwei') );
                    total += parseFloat(ethers.utils.formatUnits(b.balance.toString(),'gwei'));
                    responseArr.push([
                        `${i.fund.replace(/_/g,' ')} ${commas(formattedBalance, 2)}`,
                        formattedBalance
                    ]) 
                }
            } 
        } 
        const formattedTotal = parseInt(total); 
        return {success: true, data: responseArr, total: formattedTotal };
        
    }catch(e){
        console.log("Error:", e)
        return{success: false, message: e.message}
    }  
}

module.exports = getFunds;