<div>
<!--
  Note: tabs must be unique. (They cannot === each other.)
-->
<TabBar tabs={['Event Info', 'Tickets']} let:tab bind:active>
    <!-- Note: the `tab` property is required! -->
    <Tab {tab}>
        <TabLabel>{tab}</TabLabel>
    </Tab>
</TabBar>
{#if active === 'Event Info'}
<EventInfo event={event}/>
{/if}
{#if active === 'Tickets'}
<TicketList/>
{/if}

</div>



<script>
    import { page } from '$app/stores';
    import Textfield from '@smui/textfield';
    import Button, {Label} from '@smui/button';
    import {onMount} from "svelte";
    import {getEventById, getEventsByOwner} from "../../../lib/clients/ethicketsAbiClient.js";
    import {contractAddress, abi} from "../../../lib/constants/constants.js";
    import {provider} from "../../../lib/stores/providerStore.js";
    import {selectedAccount} from "../../../lib/stores/selectedAccountStore.js";
    import {tick} from 'svelte';
    import Tab, {Label as TabLabel,} from '@smui/tab';
    import TabBar from '@smui/tab-bar';
    import EventInfo from "../../EventInfo.svelte";
    import TicketList from "../../TicketList.svelte";

    let active = 'Event Info';

    let eventName = '';
    let eventDescription = '';
    let eventDate = '';
    let eventLocation = '';
    let imgUrl = '';
    let event;
    $: async ($selectedAccount) => { event = await getEventById($page.params.id, contractAddress, abi, $provider)}
    $: async ($provider) => { event = await getEventById($page.params.id, contractAddress, abi, $provider)}


    onMount(async () => {
            await tick();
            if($provider) {
                event = await getEventById($page.params.id, contractAddress, abi, $provider)
            } else {
                console.log('no provider')
            }
            provider.subscribe(async a => {
                event = await getEventById($page.params.id, contractAddress, abi, a)
                console.log(event);
            })
            console.log(event);


    })


</script>
<style>
    :global(.mdc-text-field__input::-webkit-calendar-picker-indicator) {
        display: initial !important;
    }
</style>