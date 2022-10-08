<script>
    import List, {Item, Meta, PrimaryText, SecondaryText, Text,} from '@smui/list';

    import {Image,} from '@smui/image-list';
    import {onMount} from "svelte";
    import {getAllEvents} from "../lib/clients/ethicketsAbiClient.js";
    import {contractAddress, abi} from "../lib/constants/constants.js";
    import {provider} from "../lib/stores/providerStore.js";
    import {goto} from "$app/navigation";

    let options = [
        {
            name: 'Bruce Willis',
            description: 'Actor',
            disabled: false,
        },
        {
            name: 'Thomas Edison',
            description: 'Inventor',
            disabled: false,
        },
        {
            name: 'Stephen Hawking',
            description: 'Scientist',
            disabled: false,
        },
    ];

    let events = [];
    // This value is updated when the component is initialized, based on the
    // selected Item's `selected` prop.
    let selectionIndex = 0;

    onMount(async () => {
        events = await getAllEvents(contractAddress, abi, $provider);
    })


</script>

<svelte:head>
    <title>Home</title>
    <meta name="description" content="Svelte demo app"/>
</svelte:head>

<section>
    <div style="width: 100%">
        <List
                class="demo-list"
                twoLine
                avatarList
                singleSelection
                bind:selectedIndex={selectionIndex}

        >
            {#each events as item (item.id)}
                <Item
                        on:click={async () => await goto(`/events/${item.id}`, {replaceState: false})}
                        disabled={item.disabled}
                        style="height: 200px"
                >
                    <Image style="width: 200px"
                           src="{item.imgUrl}"
                           alt="Image {1}"
                    />
                    <Text style="margin-left: 10px">
                        <PrimaryText style="font-size: 1.5rem;">{item.name}</PrimaryText>
                        <SecondaryText style="margin-top: 5px; height: 100px">{item.owner}</SecondaryText>
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
</style>
