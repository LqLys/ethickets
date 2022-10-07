<script>
    import Button, {Label} from '@smui/button';
    import {browser} from "$app/environment";
	import {selectedAccount} from "../lib/stores/selectedAccountStore.js";
    import {ethers} from "ethers";
    import {provider} from "../lib/stores/providerStore.js";



</script>

<svelte:head>
    <title>Home</title>
    <meta name="description" content="Svelte demo app"/>
</svelte:head>

<section>
    {#if !$selectedAccount}
        <div style="width: 100%; padding-bottom: 10px">
            <Button on:click={handleConnectWallet} variant="raised" style="width: 100%;">
                <Label>Connect Wallet</Label>
            </Button>
        </div>
    {/if}
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
