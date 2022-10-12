import {ethers} from 'ethers';

export function weiToEther(wei){
    console.log('wei: ', wei)
    const ether = ethers.utils.formatEther(wei);
    console.log(ether)
    return ether;
}

export function etherToWei(ether){
    return ethers.utils.parseEther(ether)
}