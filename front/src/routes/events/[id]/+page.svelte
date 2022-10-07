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
    <Button on:click={handleEventUpdate} variant="raised" style="width: 100%;">
        <Label>Create Event</Label>
    </Button>
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

    function handleEventUpdate(){

    }

</script>
<style>
    :global(.mdc-text-field__input::-webkit-calendar-picker-indicator) {
        display: initial !important;
    }
</style>