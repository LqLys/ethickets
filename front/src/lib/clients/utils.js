import {ethers} from 'ethers';

export function weiToEther(wei){
    return ethers.utils.formatEther(wei);
}

export function etherToWei(ether){
    return ethers.utils.parseEther(ether)
}

export function formatDisplayPrice(price, unit){
    console.log('p: ', price)
    console.log('u: ', unit)
    if(unit === 'Ether'){
        return weiToEther(price)
    }
    return price;
}

export function asWei(price, unit){
    if(unit === 'Wei'){
        return price
    }
    return etherToWei(price);
}