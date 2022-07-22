
 
const WaceoContract  = require("../../constants/abi/WaceoContract.json"); 
const MinterContract = require("../../constants/abi/MinterContract.json"); 
const getAddresses = require("./../../constants/addresses") 
 
 

const getPrices = async ( Moralis) => { 
    try{ 
          const _addresses = getAddresses(43113); 

          // Get total supply of WACEO token
          const totalSupply = await Moralis.Web3API.native.runContractFunction({
            chain: _addresses.ChainId_Hex,
            address: _addresses.Waceo,
            function_name: "totalSupply",
            abi: WaceoContract,
            params: {},
          }); 
           
          // Get waceo price in avax from Minter contract
          const waceoPriceInAvax = await Moralis.Web3API.native.runContractFunction({
            chain: _addresses.ChainId_Hex,
            address: _addresses.Minter,
            function_name: "waceoValueInBaseToken",
            abi: MinterContract,
            params: {},
          });  
        
          // Get stable and base tokens data
          const tokensArrayMetadata = await Moralis.Web3API.token.getTokenMetadata({
            chain: _addresses.ChainId_Hex,
            addresses: [
                _addresses.Stable,
                _addresses.Base 
            ],
          });
        
          // Set decimals
          const stableTokenDecimals = parseFloat(tokensArrayMetadata[0].decimals);
          const baseTokenDecimals = parseFloat(tokensArrayMetadata[1].decimals); 
          let baseTokenAmont = null;
          let stableTokenAmont =  null;
           

          // Get token balances of LP address
          const balances = await Moralis.Web3API.account.getTokenBalances({
            chain: _addresses.ChainId_Hex,
            address: _addresses.Base_Stable_LP 
          });
         
          // Set token balances of LP address
          for(let i of balances){
            if(i.token_address.toLowerCase() == _addresses.Stable.toLowerCase()){ 
              stableTokenAmont = parseFloat(i.balance);
            }else  if(i.token_address.toLowerCase() == _addresses.Base.toLowerCase()){
              baseTokenAmont = parseFloat(i.balance);
            }
          }
         
          if(baseTokenAmont && stableTokenAmont){ 
            // Calculate prices
            const formatedTotalSupply =  parseFloat(parseFloat(totalSupply)/(10**9)).toFixed(4); 
            const formatedWaceoPriceInAvax = parseFloat(waceoPriceInAvax)/(10**9);
            
            const formattedBaseTokenAmount = parseFloat( baseTokenAmont)/ ( 10**parseFloat(baseTokenDecimals));
            const formattedStableTokenAmount = parseFloat(stableTokenAmont)/ (10**parseFloat(stableTokenDecimals));
 
            const avaxPriceInUSD = formattedStableTokenAmount/formattedBaseTokenAmount; 
            const waceoPriceInUSD =  avaxPriceInUSD*formatedWaceoPriceInAvax; 
            const formatedWaceoPriceInUSD =  waceoPriceInUSD.toFixed(4);
            const indicator = _addresses.EUR_USD_Indicator;
            const waceoPriceInEUR = parseFloat(waceoPriceInUSD)*parseFloat(indicator);
            const formatedWaceoPriceInEUR = waceoPriceInEUR.toFixed(4);
          
            const prices = {
                waceoPriceInUsd: formatedWaceoPriceInUSD.toString(),
                waceoPriceInEur: formatedWaceoPriceInEUR.toString(),
                waceoPriceInAvax: formatedWaceoPriceInAvax.toString(),
                waceoTotalSupply: formatedTotalSupply.toString()
            };
          
            return {
                success: true,
                prices
            };
        
          }else{
            return { success: false };
          } 
       
    }catch(e){
        console.log("Error:",e);
    } 
}
module.exports = getPrices;