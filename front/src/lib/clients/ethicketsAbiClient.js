import {abi, contractAddress} from "../constants/constants.js";
import {selectedAccountEvents} from "../stores/eventStores.js";
import {provider} from '../stores/providerStore.js'
import {ethers} from "ethers";

let pro;

provider.subscribe(a => pro = a);

export const getContract = (contractAddress, abi) => {
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = pro.getSigner();
    return new ethers.Contract(contractAddress, abi, signer);
}

export async function getEventsByOwner() {
    const contract = getContract(contractAddress, abi);
    try {
        console.log('pro: ',pro);
        const eventz = await contract.getEventsByOwner(pro.provider.selectedAddress.toString())
        console.log('tu')
        console.log(eventz);
        selectedAccountEvents.update(e => eventz);

    } catch (err) {
        console.log(err)
    }
}
