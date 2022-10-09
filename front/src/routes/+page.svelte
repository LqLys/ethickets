<script>
    import List, {Item, Meta, PrimaryText, SecondaryText, Text,} from '@smui/list';

    import {Image,} from '@smui/image-list';
    import {onMount} from "svelte";
    import {getAllEvents} from "../lib/clients/ethicketsAbiClient.js";
    import {abi, contractAddress} from "../lib/constants/constants.js";
    import {provider} from "../lib/stores/providerStore.js";
    import {goto} from "$app/navigation";
    import {Input} from '@smui/textfield';
    import Paper from '@smui/paper';
    import Fab from '@smui/fab';
    import {Icon} from '@smui/common';

    let searchValue = '';
    let filteredEvents = [];
    let events = [];


    onMount(async () => {
        events = await getAllEvents(contractAddress, abi, $provider);
        filteredEvents = [...events]
    })

    function doSearch() {
        if (searchValue) {
            filteredEvents = events.filter(ev => ev.name.toLowerCase().includes(searchValue))
        } else {
            filteredEvents = [...events];
        }
    }

    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            doSearch();
        }
    }
</script>

<svelte:head>
    <title>Home</title>
    <meta name="description" content="Svelte demo app"/>
</svelte:head>

<section>
    <div class="solo-demo-container solo-container" style="width: 100%">
        <Paper class="solo-paper" elevation={6}>
            <Icon class="material-icons">search</Icon>
            <Input
                    bind:value={searchValue}
                    on:keydown={handleKeyDown}
                    placeholder="Search"
                    class="solo-input"
            />
        </Paper>
        <Fab
                on:click={doSearch}
                disabled={searchValue === ''}
                color="primary"
                mini
                class="solo-fab"
        >
            <Icon class="material-icons">arrow_forward</Icon>
        </Fab>
    </div>
    <div style="width: 100%">
        <List
                class="demo-list"
                twoLine
                avatarList
                singleSelection
        >
            {#each filteredEvents as item (item.id)}
                <Item
                        on:click={async () => await goto(`/events/${item.id}`, {replaceState: false})}
                        disabled={item.disabled}
                        style="height: 200px; width: 100%; padding: 0px"
                >
                    <Image style="width: 200px"
                           src="{item.imgUrl}"
                           alt="Image {1}"
                    />
                    <Text style="margin-left: 10px; width: 100%">
                        <PrimaryText style="font-size: 1.5rem;">{item.name}</PrimaryText>
                        <SecondaryText style="margin-top: 5px;">Organized by: {item.owner}</SecondaryText>
                        <SecondaryText style="margin-top: 5px;">Location: {item.location}</SecondaryText>
                        <SecondaryText style="margin-top: 5px;">
                            Time: {new Date(+item.dateTime).toLocaleString()}</SecondaryText>
                        <SecondaryText style="margin-top: 5px;">{item.description}</SecondaryText>
                    </Text>
                    <Meta class="material-icons">info</Meta>
                </Item>
            {/each}
        </List>
    </div>
</section>

<style>

    section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 0.6;
    }

    h1 {
        width: 100%;
    }

    .welcome {
        display: block;
        position: relative;
        width: 100%;
        height: 0;
        padding: 0 0 calc(100% * 495 / 2048) 0;
    }

    .welcome img {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        display: block;
    }

    .solo-demo-container {
        padding-top: 8px;
        padding-bottom: 8px;
        background-color: var(--mdc-theme-background, #f8f8f8);
        border: 1px solid var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));
    }

    .solo-container {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    * :global(.solo-paper) {
        display: flex;
        align-items: center;
        flex-grow: 1;
        max-width: 600px;
        margin: 0 12px;
        padding: 0 12px;
        height: 48px;
    }

    * :global(.solo-paper > *) {
        display: inline-block;
        margin: 0 12px;
    }

    * :global(.solo-input) {
        flex-grow: 1;
        color: var(--mdc-theme-on-surface, #000);
    }

    * :global(.solo-input::placeholder) {
        color: var(--mdc-theme-on-surface, #000);
        opacity: 0.6;
    }

    * :global(.solo-fab) {
        flex-shrink: 0;
    }
</style>
