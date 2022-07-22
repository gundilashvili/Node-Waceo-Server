const getAddresses = require ("../../constants/addresses");     
const { commas } = require('number-prettier');

const getTreasuryAssets = async ( Moralis ) => { 
    try{
 
      
        const _addresses = getAddresses(43113); 
        if(_addresses){   

            const supportedTokensArray = _addresses.Supported_Tokens;
            let responseArr = [];
            let total = 0;


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
            const baseTokenSymbol = tokensArrayMetadata[1].symbol;  
            let baseTokenAmont = null;
            let stableTokenAmont =  null;
            let baseTokenPriceInUSD = null;
  
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
              const formattedBaseTokenAmount = parseFloat( baseTokenAmont)/ ( 10**parseFloat(baseTokenDecimals));
              const formattedStableTokenAmount = parseFloat(stableTokenAmont)/ (10**parseFloat(stableTokenDecimals)); 
              baseTokenPriceInUSD = formattedStableTokenAmount/formattedBaseTokenAmount;   
            }else{
              return null;
            }


            const treasuryAssets = await Moralis.Web3API.account.getTokenBalances({
                chain: _addresses.ChainId_Hex,
                address: _addresses.Treasury 
            });
             
            for(let i of treasuryAssets){ 
                let isSupported = false;
                let tokenObj = null;

                for(let b of supportedTokensArray){
                   if(i.token_address.toLowerCase() == b.tokenAddress.toLowerCase()){
                     isSupported = true;
                     tokenObj = b;
                   }
                }
                if(isSupported){
                    const decimals =  i.decimals;
                    const symbol =  i.symbol;
                    const balance = i.balance; 
                    const lpAssets = await Moralis.Web3API.account.getTokenBalances({
                        chain: _addresses.ChainId_Hex,
                        address: tokenObj.lpAddress
                    });


                    let _baseAmount = 0;
                    let _tokenAmount = 0;
                    for(let c of lpAssets){
                        if(c.token_address.toLowerCase() == _addresses.Base.toLowerCase()){
                            _baseAmount = c.balance;
                        }else if(c.token_address.toLowerCase() == i.token_address.toLowerCase()){
                            _tokenAmount = c.balance;
                        }
                    }

                    if( 
                        parseFloat(_baseAmount.toString()) > 0 && 
                        parseFloat(_tokenAmount.toString()) > 0 &&
                        parseFloat(balance.toString()) > 0 
                    ){ 
                        const formattedBalance = parseFloat(balance.toString())/(10**decimals);
                        const formattedBaseAmount = parseFloat(_baseAmount.toString())/(10**baseTokenDecimals);
                        const formattedTokenAmount = parseFloat(_tokenAmount.toString())/(10**decimals);
                        
                        const tokenValueInAvax = formattedBaseAmount/formattedTokenAmount;
                        const tokenPriceInUSD = parseFloat(tokenValueInAvax*baseTokenPriceInUSD).toFixed(6);
                        const marketValueOfTokenBalance = formattedBalance*tokenPriceInUSD;
                        total = total + marketValueOfTokenBalance;
        
                        let baseFundName = `${symbol} - ${commas(parseInt(marketValueOfTokenBalance),2)} $`
                        responseArr.push([baseFundName,parseInt(marketValueOfTokenBalance) ])
                    } 
                }else if(i.token_address.toLowerCase() == _addresses.Base.toLowerCase()){
                    const baseTokenBalance = i.balance;
                    const formattedBaseTokenBalance = parseFloat(baseTokenBalance.toString())/(10**baseTokenDecimals);
                    const baseTokenMarketValue = formattedBaseTokenBalance*baseTokenPriceInUSD;
                    total = total + baseTokenMarketValue;
                    let baseFundName = `${baseTokenSymbol} - ${commas(parseInt(baseTokenMarketValue),2)} $`
                    responseArr.push([baseFundName, parseInt(baseTokenMarketValue)]);
                }
            } 

            const formattedTotal =  parseInt(total); 
            return {success: true, data: responseArr, total: formattedTotal };
        }else{
            return{success: false}
        }
    }catch(e){
        console.log(e)
        return{success: false, message: e.message}
    }  
}

module.exports = getTreasuryAssets;