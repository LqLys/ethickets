<div style="width: 100%">
    <List
            class="demo-list"
            twoLine
            avatarList
            singleSelection
    >
        {#each tickets as item (item.id)}
            {#if item.isForSale || item.owner.toLowerCase() === $selectedAccount.toLowerCase()}
                <TicketListItem ticketData={item} buyFn={handleBuyTicket} editFn={handleEditTicket} lockInFn={handleLockInTicket}/>
            {/if}
        {/each}
    </List>

    <div style="width: 100%; padding-bottom: 10px">
        <Textfield bind:value={ticketsAmount} type="number" label="Amount to add" style="width: 100%;"
                   variant="outlined">
        </Textfield>
    </div>
    <div style="width: 100%; padding-bottom: 10px">
        <Textfield bind:value={ticketPrice} type="number" label="Price" style="width: 100%;" variant="outlined">
        </Textfield>
    </div>

    <div style="width: 100%; padding-bottom: 10px">
        <Button on:click={handleAddTicketsToEvent} variant="raised" style="width: 100%;">
            <Label>Add tickets</Label>
        </Button>
    </div>
</div>

<script>
    import List, {Item,} from '@smui/list';
    import {onMount} from "svelte";
    import {
        addTickets,
        buyTicket,
        editTicket,
        getEventTickets,
        lockInTicket
    } from "../lib/clients/ethicketsAbiClient.js";
    import {page} from "$app/stores";
    import {abi, contractAddress} from "../lib/constants/constants.js";
    import {provider} from "../lib/stores/providerStore.js";
    import {selectedAccount} from "../lib/stores/selectedAccountStore.js";
    import Card, {ActionButtons, ActionIcons, Actions, Content,} from '@smui/card';
    import Checkbox from '@smui/checkbox';

    import Button, {Label} from '@smui/button';
    import Textfield from '@smui/textfield';
    import {weiToEther} from "../lib/clients/utils";
    import TicketListItem from "./TicketListItem.svelte";

    let tickets = [];

    let ticketsAmount = 0;
    let ticketPrice = 0;

    onMount(async () => {
        tickets = await getEventTickets($page.params.id, contractAddress, abi, $provider);
    })

    async function handleAddTicketsToEvent() {
        await addTickets($page.params.id, ticketsAmount, ticketPrice, contractAddress, abi, $provider);
        tickets = await getEventTickets($page.params.id, contractAddress, abi, $provider);
    }

    async function handleBuyTicket(ticketId, price) {
        await buyTicket($page.params.id, ticketId, price, contractAddress, abi, $provider)
        tickets = await getEventTickets($page.params.id, contractAddress, abi, $provider);
    }

    async function handleEditTicket(ticketId, isForSale, price) {
        await editTicket($page.params.id, ticketId, isForSale, price, contractAddress, abi, $provider)
        tickets = await getEventTickets($page.params.id, contractAddress, abi, $provider);
    }

    async function handleLockInTicket(ticketId) {
        await lockInTicket($page.params.id, ticketId, contractAddress, abi, $provider);
        tickets = await getEventTickets($page.params.id, contractAddress, abi, $provider);
    }

</script>