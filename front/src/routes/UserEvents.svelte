<Accordion multiple>
    <Panel bind:open={createEventOpen}>
        <Header style="text-align: center">
            <span style="position:absolute;">Create Event</span>
            <IconButton slot="icon" toggle pressed={createEventOpen}>
                <Icon class="material-icons" on>expand_less</Icon>
                <Icon class="material-icons">expand_more</Icon>
            </IconButton>
        </Header>
        <PanelContent>
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
        </PanelContent>
    </Panel>

</Accordion>


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
    import {selectedAccountEvents} from "../lib/stores/eventStores.js";
    import {provider} from "../lib/stores/providerStore.js";
    import {onMount} from "svelte";
    import {createEvent, getContract, getEventsByOwner} from "../lib/clients/ethicketsAbiClient.js";
    import {goto} from "$app/navigation";
    import {abi, contractAddress} from "../lib/constants/constants.js";
    import Accordion, {Content as PanelContent, Header, Panel} from '@smui-extra/accordion';
    import IconButton, {Icon} from '@smui/icon-button';


    // export let provider;
    let createEventOpen = false;
    let eventName = '';
    let eventDescription = '';
    let eventDate = '';
    let eventLocation = '';
    let imgUrl = '';
    $: async ($selectedAccount) => {
        await getEventsByOwner(contractAddress, abi, $provider);
    }

    onMount(async () => {
        await getEventsByOwner(contractAddress, abi, $provider);
    })

    async function handleCreateEvent() {
        if (browser && typeof window.ethereum !== "undefined") {
            const date1 = new Date(eventDate);
            const timestamp = date1.getTime();

            await createEvent(eventName, eventDescription, timestamp, eventLocation, imgUrl, contractAddress, abi, $provider)
            clearFormFields();
            await getEventsByOwner(contractAddress, abi, $provider);
        }
    }

    function clearFormFields() {
        eventName = '';
        eventDescription = '';
        eventDate = '';
        eventLocation = '';
        imgUrl = '';
    }

    async function getEvents() {
        if (browser && typeof window.ethereum !== "undefined") {
            const contract = await getContract(contractAddress, abi, provider);
            try {
                const eventz = await contract.getEvents()
                selectedAccountEvents.update(e => eventz);

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