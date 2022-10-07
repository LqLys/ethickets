<script>
	import Header from './Header.svelte';
	import './styles.css';
	import {onDestroy, onMount} from "svelte";
	import {ethers} from "ethers";
	import {provider} from "../lib/stores/providerStore.js";
	import {browser} from "$app/environment";
	import {selectedAccount} from "../lib/stores/selectedAccountStore.js";
	import {getEventsByOwner} from "../lib/clients/ethicketsAbiClient.js";
	import {contractAddress, abi} from "../lib/constants/constants.js";
	import Button, {Label} from '@smui/button';

	let web3Provider;

	onMount(async () => {
		console.log('mount')
		if (typeof window.ethereum === "undefined") {
			setTimeout(() => {
				alert("You need to have Metamask installed.");
			}, 1000)
		} else {
			web3Provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
			provider.update(e => web3Provider);

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
			selectedAccount.update(a => '')
		} else if (addresses[0] !== selectedAccount) {
			console.log('account changed')
			selectedAccount.update(e => addresses[0])
			await getEventsByOwner(contractAddress, abi, $provider);
		}
	};

	const handleChainChanged = () => {
		window.location.reload();
	}

	const handleDisconnect = () => {
		// selectedAccount = null;
		window.location.reload();
	}

	async function requestAccount() {
		await window.ethereum.request({method: "eth_requestAccounts"});
	}


	const disconnectWallet = () => {
		// selectedAccount = null;
	};

	async function handleConnectWallet() {
		if (browser) {
			try {
					const accounts = await window.ethereum.request({method: "eth_requestAccounts"});
				selectedAccount.update(e => accounts[0]);
			} catch (err) {
				console.log(err);
			}
		}
	}

</script>

<div class="app">
	<Header />

	<main>
		{#if !$selectedAccount}
			<div style="padding-bottom: 10px">
				<Button on:click={handleConnectWallet} variant="raised" style="width: 100%;">
					<Label>Connect Wallet</Label>
				</Button>
			</div>
			{:else}
			<slot />
		{/if}

	</main>

	<footer>
		<p>visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit</p>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
