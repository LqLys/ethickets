// import {abi, contractAddress} from "../constants/constants.js";
import {selectedAccountEvents} from "../stores/eventStores.js";
// import {provider} from '../stores/providerStore.js'
import {ethers} from "ethers";

let pro;

// provider.subscribe(a => pro = a);

export const getContract = (contractAddress, abi, provider) => {
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, abi, signer);
}

export async function getEventsByOwner(contractAddress, abi, provider) {
    const contract = getContract(contractAddress, abi, provider);
    try {
        const eventz = await contract.getEventsByOwner(provider.provider.selectedAddress.toString())
        selectedAccountEvents.update(e => eventz);

    } catch (err) {
        console.log(err)
    }
}

export async function getEventById(eventId, contractAddress, abi, provider) {
    const contract = getContract(contractAddress, abi, provider);
    try {
        const event = await contract.events(eventId)
        return event;

    } catch (err) {
        console.log(err)
    }
}
