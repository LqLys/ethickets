<div style="width: 100%">
    <div class="radio-demo">
        Unit price:
        {#each options as option}
            <FormField>
                <Radio
                        bind:group={priceUnit}
                        value={option.name}
                        disabled={option.disabled}
                        on:click={() =>handlePriceUnitSelected(option.name)}
                />
                <span slot="label">
        {option.name}
      </span>
            </FormField>
        {/each}
    </div>
    <div class="radio-demo">
        Ticket filter options:
        {#each ticketFilterOptions as option}
            <FormField>
                <Radio
                        bind:group={ticketFilter}
                        value={option.name}
                        disabled={option.disabled}
                        on:click={() =>handleTicketFilterChaned(option.name)}
                />
                <span slot="label">
        {option.name}
      </span>
            </FormField>
        {/each}
    </div>

    <List
            class="demo-list"
            twoLine
            avatarList
            singleSelection
    >
        {#each filteredTickets as item (item.id)}
            {#if item.isForSale || item.owner.toLowerCase() === $selectedAccount.toLowerCase()}
                <TicketListItem ticketData={item} buyFn={handleBuyTicket} editFn={handleEditTicket}
                                lockInFn={handleLockInTicket} priceUnit={priceUnit}/>
            {/if}
        {/each}
    </List>

    <div class="accordion-container">
        <Accordion multiple>
            {#if $selectedAccount.toLowerCase() === event?.owner?.toLowerCase()}
                <Panel bind:open={addTicketsPanelOpen}>
                    <Header style="text-align: center">
                        Add Tickets
                        <IconButton slot="icon" toggle pressed={addTicketsPanelOpen}>
                            <Icon class="material-icons" on>expand_less</Icon>
                            <Icon class="material-icons">expand_more</Icon>
                        </IconButton>
                    </Header>
                    <PanelContent>
                        <div style="width: 100%; padding-bottom: 10px">
                            <Textfield bind:value={ticketsAmount} type="number" label="Amount to add"
                                       style="width: 100%;"
                                       variant="outlined">
                            </Textfield>
                        </div>
                        <div style="width: 100%; padding-bottom: 10px">
                            <Textfield value={displayTicketPrice}
                                       on:input={e => ticketPrice = asWei(e.target.value, $selectedUnitPrice)}
                                       type="text" label="Price" style="width: 100%;" variant="outlined">
                            </Textfield>
                        </div>

                        <div style="width: 100%; padding-bottom: 10px">
                            <Button on:click={handleAddTicketsToEvent} variant="raised" style="width: 100%;">
                                <Label>Add tickets</Label>
                            </Button>
                        </div>
                    </PanelContent>
                </Panel>
            {/if}
        </Accordion>
    </div>


</div>

<script>
    import List from '@smui/list';
    import {onMount} from "svelte";
    import {
        addTickets,
        buyTicket,
        editTicket,
        getEventTickets,
        lockInTicket
    } from "../lib/clients/ethicketsAbiClient.js";
    import Radio from '@smui/radio';
    import FormField from '@smui/form-field';
    import {page} from "$app/stores";
    import {abi, contractAddress} from "../lib/constants/constants.js";
    import {provider} from "../lib/stores/providerStore.js";
    import {selectedAccount} from "../lib/stores/selectedAccountStore.js";
    import {selectedUnitPrice} from "../lib/stores/unitPriceStore.js";
    import Button, {Label} from '@smui/button';
    import Textfield from '@smui/textfield';
    import TicketListItem from "./TicketListItem.svelte";
    import Accordion, {Content as PanelContent, Header, Panel} from '@smui-extra/accordion';
    import IconButton, {Icon} from '@smui/icon-button'
    import {asWei, formatDisplayPrice} from "../lib/clients/utils.js";

    export let event;
    let tickets = [];

    let ticketsAmount = 0;
    let ticketPrice = 0;
    $: displayTicketPrice = formatDisplayPrice(ticketPrice, $selectedUnitPrice)

    let addTicketsPanelOpen = false;
    $: filteredTickets = applyTicketFilter(tickets, ticketFilter);

    let options = [
        {
            name: 'Ether',
            disabled: false,
        },
        {
            name: 'Wei',
            disabled: false,
        }
    ];

    let ticketFilterOptions = [
        {
            name: 'All'
        },
        {
            name: 'Owned'
        },
        {
            name: 'For Sale'
        }
    ]
    let priceUnit = 'Ether';
    let ticketFilter = 'Owned';

    onMount(async () => {
        tickets = await getEventTickets($page.params.id, contractAddress, abi, $provider)
    })

    function applyTicketFilter(tickets, filter) {
        switch (filter) {
            case "Owned":
                return tickets.filter(t => t.owner?.toLowerCase() === $selectedAccount.toLowerCase());
            case "All":
                return [...tickets];
            case "For Sale":
                return tickets.filter(t => t.owner?.toLowerCase() !== $selectedAccount.toLowerCase() && !!t.isForSale)
            default:
                return [...tickets];
        }
    }

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

    function handlePriceUnitSelected(unit) {
        selectedUnitPrice.update(e => unit);
    }
    function handleTicketFilterChaned(filter) {
        ticketFilter = filter;
    }
</script>