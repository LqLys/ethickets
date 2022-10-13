<div>
    <TabBar tabs={['Event Info', 'Tickets']} let:tab bind:active>
        <!-- Note: the `tab` property is required! -->
        <Tab {tab}>
            <TabLabel>{tab}</TabLabel>
        </Tab>
    </TabBar>
    {#await eventPromise}
        Loading...
    {:then event}
        {#if active === 'Event Info'}
            <EventInfo event={event} on:changeTab={handleChangeTab}/>
        {/if}
        {#if active === 'Tickets'}
            <TicketList event="{event}"/>
        {/if}
    {:catch error}
        Something went wrong...
    {/await}
</div>


<script>
    import {page} from '$app/stores';
    import {onMount} from "svelte";
    import {getEventById} from "../../../lib/clients/ethicketsAbiClient.js";
    import {abi, contractAddress} from "../../../lib/constants/constants.js";
    import {provider} from "../../../lib/stores/providerStore.js";
    import Tab, {Label as TabLabel,} from '@smui/tab';
    import TabBar from '@smui/tab-bar';
    import EventInfo from "../../EventInfo.svelte";
    import TicketList from "../../TicketList.svelte";

    let active = 'Event Info';
    let eventPromise;

    onMount(async () => {
        eventPromise = getEventById($page.params.id, contractAddress, abi, $provider)
    })

    function handleChangeTab() {
        active = 'Tickets';
    }

</script>
<style>
    :global(.mdc-text-field__input::-webkit-calendar-picker-indicator) {
        display: initial !important;
    }
</style>