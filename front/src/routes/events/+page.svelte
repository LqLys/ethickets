
    <div>
        <!--
          Note: tabs must be unique. (They cannot === each other.)
        -->
        <TabBar tabs={['Your Events']} let:tab bind:active>
            <!-- Note: the `tab` property is required! -->
            <Tab {tab}>
                <TabLabel>{tab}</TabLabel>
            </Tab>
        </TabBar>
        {#if active === 'Your Events'}
            <UserEvents />
        {/if}
        <!--{#if active === 'Tickets'}-->

        <!--{/if}-->
    </div>



<script>
    import {ethers} from "ethers";
    import {onDestroy, onMount} from "svelte";
    import {abi, contractAddress} from "../../lib/constants/constants.js";
    import {browser} from "$app/environment";
    import Button, {Label} from '@smui/button';
    import Tab, {Label as TabLabel,} from '@smui/tab';
    import TabBar from '@smui/tab-bar';
    import UserEvents from "../UserEvents.svelte";
    import {provider} from "../../lib/stores/providerStore.js";
    import {getEventsByOwner} from "../../lib/clients/ethicketsAbiClient.js";
    import Paper, { Title, Content } from '@smui/paper';



    let active = 'Your Events';

    let eventName = '';
    let eventDescription = '';
    let eventDate = '';
    let eventLocation = '';
    let imgUrl = '';




</script>
<style>

</style>