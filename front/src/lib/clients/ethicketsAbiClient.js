// import {abi, contractAddress} from "../constants/constants.js";
import {selectedAccountEvents} from "../stores/eventStores.js";
// import {provider} from '../stores/providerStore.js'
import {ethers} from "ethers";
import {abi, contractAddress} from "../constants/constants.js";
import {provider} from "../stores/providerStore.js";

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

export async function getAllEvents(contractAddress, abi, provider) {
    const contract = getContract(contractAddress, abi, provider);
    try {
        const events = await contract.getEvents()
        return events;

    } catch (err) {
        console.log(err)
    }
}

export async function getEventTickets(eventId, contractAddress, abi, provider) {
    const contract = getContract(contractAddress, abi, provider);
    try {
        const tickets = await contract.getEventTickets(eventId)
        return tickets;

    } catch (err) {
        console.log(err)
    }
}

export async function createEvent(eventName, eventDescription, timestamp, eventLocation, imgUrl, contractAddress, abi, provider){

    const contract = getContract(contractAddress, abi, provider);
    try {
        const transaction = await contract.createEvent(eventName, eventDescription, timestamp, eventLocation, imgUrl);
        const eventId = await transaction.wait();
        console.log('eventId: ', eventId)

    } catch (err) {
        console.log(err)
    }
}

export async function addTickets(eventId, ticketsAmount, ticketPrice, contractAddress, abi, provider){

    const contract = getContract(contractAddress, abi, provider);
    try {
        const transaction = await contract.addTicketsToEvent(eventId, ticketsAmount, ticketPrice);
        await transaction.wait();
        console.log('eventId: ', eventId)

    } catch (err) {
        console.log(err)
    }
}

export async function buyTicket(eventId, ticketId, price, contractAddress, abi, provider){
    const contract = getContract(contractAddress, abi, provider);

    try {
        const options = {
            value: price
        }
        const transaction = await contract.buyTicket(eventId, ticketId, options);
        await transaction.wait();

    }catch (err) {
        console.log(err);
    }
}

export async function editTicket(eventId, ticketId, isForSale, price, contractAddress, abi, provider){

    const contract = getContract(contractAddress, abi, provider);
    try {
        const transaction = await contract.editTicketData(eventId, ticketId, isForSale, price);
        await transaction.wait();

    } catch (err) {
        console.log(err)
    }
}

export async function lockInTicket(eventId, ticketId, contractAddress, abi, provider){

    const contract = getContract(contractAddress, abi, provider);
    try {
        const transaction = await contract.lockInTicket(eventId, ticketId);
        await transaction.wait();

    } catch (err) {
        console.log(err)
    }
}
