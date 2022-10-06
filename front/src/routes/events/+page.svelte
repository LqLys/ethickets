{#if !selectedAccount}
    <div style="width: 100%; padding-bottom: 10px">
        <Button on:click={handleConnectWallet} variant="raised" style="width: 100%;">
            <Label>Connect Wallet</Label>
        </Button>
    </div>
{:else }
    <Paper color="primary">
        <Title style="text-align: center">Selected Wallet</Title>
        <Content style="text-align: center"> {selectedAccount} </Content>
    </Paper>

    <div>
        <!--
          Note: tabs must be unique. (They cannot === each other.)
        -->
        <TabBar tabs={['Events', 'Tickets']} let:tab bind:active>
            <!-- Note: the `tab` property is required! -->
            <Tab {tab}>
                <TabLabel>{tab}</TabLabel>
            </Tab>
        </TabBar>
        {#if active === 'Events'}
            <UserEvents provider={provider}/>
        {/if}
        <!--{#if active === 'Tickets'}-->

        <!--{/if}-->
    </div>


{/if}


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


    let active = 'Events';

    let eventName = '';
    let eventDescription = '';
    let eventDate = '';
    let eventLocation = '';
    let imgUrl = '';


    let selectedAccount;
    let allEvents = [];
    $: {
        console.log(allEvents)
    }


    async function handleConnectWallet() {
        if (browser) {

            try {
                const accounts = await window.ethereum.request({method: "eth_requestAccounts"});
                selectedAccount = accounts[0];
            } catch (err) {
                console.log(err);
            }
        }
    }

    onMount(async () => {

        if (browser && typeof window.ethereum === "undefined") {
            setTimeout(() => {
                alert("You need to have Metamask installed.");
            }, 1000)
        } else {
            const p = new ethers.providers.Web3Provider(window.ethereum, 'any');
            provider.update(e => p);
            window.ethereum.on("chainChanged", handleChainChanged)
            window.ethereum.on("accountsChanged", handleAccountsChanged)
            window.ethereum.on("disconnect", handleDisconnect)
        }

    })

    onDestroy(() => {
        if (browser) {
            window.ethereum.removeListener("chainChanged", handleChainChanged)
            window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
            window.ethereum.removeListener("disconnect", handleDisconnect)
        }
    })

    const handleAccountsChanged = async () => {
        // provider = new ethers.providers.Web3Provider(window.ethereum);
        const addresses = await $provider.listAccounts();
        if (addresses.length === 0) {
            console.log("Please connect to Metamask");
            selectedAccount = null;
        } else if (addresses[0] !== selectedAccount) {
            selectedAccount = addresses[0];
            await getEventsByOwner();
        }
    };

    const handleChainChanged = () => {
        window.location.reload();
    }

    const handleDisconnect = () => {
        selectedAccount = null;
        window.location.reload();
    }

    async function requestAccount() {
        await window.ethereum.request({method: "eth_requestAccounts"});
    }


    const disconnectWallet = () => {
        selectedAccount = null;
    };



</script>
<style>
    :global(.mdc-text-field__input::-webkit-calendar-picker-indicator) {
        display: initial !important;
    }
</style>