<div style="width: 100%; padding-bottom: 10px">
    <Textfield bind:value={eventName} label="Name" style="width: 100%;" variant="outlined">
    </Textfield>
</div>
<div style="width: 100%; padding-bottom: 10px">
    <Textfield bind:value={eventLocation} label="Location" style="width: 100%;" variant="outlined">
    </Textfield>
</div>
<div style="width: 100%; padding-bottom: 10px">
    <Textfield bind:value={imgUrl} label="Image url" style="width: 100%;" variant="outlined">
    </Textfield>
</div>
<div style="width: 100%; padding-bottom: 10px">
    <Textfield style="width: 100%;" variant="outlined"
               bind:value={eventDate}
               label="Event Time"
               type="datetime-local"
    />
</div>
<div style="width: 100%; padding-bottom: 10px">
    <Textfield textarea bind:value={eventDescription} label="Description" style="width: 100%;"
               variant="outlined">
    </Textfield>
</div>
<div style="width: 100%; padding-bottom: 10px">
    <Button on:click={handleCreateEvent} variant="raised" style="width: 100%;">
        <Label>Create Event</Label>
    </Button>
</div>
<div style="width: 100%">
    <DataTable table$aria-label="People list" style="width: 100%;">
        <Head>
            <Row>
                <Cell>Name</Cell>
                <Cell>Location</Cell>
                <Cell>Time</Cell>
            </Row>
        </Head>
        <Body>

        {#each $selectedAccountEvents as event (event.id)}
            <Row on:click={async () => await goto(`/events/${event.id}`, {replaceState: false})}>
                <Cell>{event.name}</Cell>
                <Cell>{event.location}</Cell>
                <Cell>{new Date(+event.dateTime).toLocaleString()}</Cell>
            </Row>
        {/each}
        </Body>
    </DataTable>
</div>

<script>
    import DataTable, {Body, Cell, Head, Row} from '@smui/data-table';
    import Textfield from '@smui/textfield';
    import Button, {Label} from '@smui/button';
    import {browser} from "$app/environment";
    import {ethers} from "ethers";
    import {selectedAccountEvents} from "../lib/stores/eventStores.js";
    import {selectedAccount} from "../lib/stores/selectedAccountStore.js";
    import {provider} from "../lib/stores/providerStore.js";
    import {onMount} from "svelte";
    import {getContract} from "../lib/clients/ethicketsAbiClient.js";
    import {getEventsByOwner} from "../lib/clients/ethicketsAbiClient.js";
    import {goto} from "$app/navigation";
    import {contractAddress, abi} from "../lib/constants/constants.js";


    // export let provider;

    let eventName = '';
    let eventDescription = '';
    let eventDate = '';
    let eventLocation = '';
    let imgUrl = '';
    $: async ($selectedAccount) => { await getEventsByOwner(contractAddress, abi, $provider);}

    onMount(async () => {
        // await getEventsByOwner(contractAddress, abi, $provider);
        // console.log($provider.provider.selectedAddress)
    })

    async function handleCreateEvent() {
        if (browser && typeof window.ethereum !== "undefined") {
            const date1 = new Date(eventDate);
            const timestamp = date1.getTime();
            console.log(timestamp);

            const contract = getContract(contractAddress, abi, provider);

            try {
                const transaction = await contract.createEvent(eventName, eventDescription, timestamp, eventLocation, imgUrl);
                const eventId = await transaction.wait();
                console.log('eventId: ', eventId)
                await getEventsByOwner(contractAddress, abi, provider);
                clearFormFields();
                // selectedAccountEvents.update(e => [...e]);
            } catch (err) {
                console.log(err)
            }
        }
    }

    function clearFormFields(){
        eventName = '';
        eventDescription = '';
        eventDate = '';
        eventLocation = '';
        imgUrl = '';
    }

    async function getEvents() {
        if (browser && typeof window.ethereum !== "undefined") {
            const contract = getContract(contractAddress, abi, provider);
            try {
                 const eventz = await contract.getEvents()
                selectedAccountEvents.update( e => eventz);

            } catch (err) {
                console.log(err)
            }
        }
    }

</script>
<style>
    :global(.mdc-text-field__input::-webkit-calendar-picker-indicator) {
        display: initial !important;
    }
</style>