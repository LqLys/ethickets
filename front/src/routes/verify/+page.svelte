<div>
    <div>
        <LinearProgress {progress} {closed}/>
    </div>
    <div>{Math.trunc(hash * 10000)}</div>
    <div>selected account: {$selectedAccount.toLowerCase()}</div>
    <div> ticket owner: {ticketData?.owner?.toLowerCase()}</div>
    {#if $selectedAccount?.toLowerCase() === ticketData?.owner?.toLowerCase()}
        You own this ticket
    {:else}
        You don't own this ticket
    {/if}
</div>

<script>
    import {page} from "$app/stores";
    import {onDestroy, onMount} from "svelte";
    import moment from "moment";
    import seedrandom from "seedrandom";
    import LinearProgress from "@smui/linear-progress";
    import {getTicketData} from "../../lib/clients/ethicketsAbiClient.js";
    import {selectedAccount} from "../../lib/stores/selectedAccountStore.js";
    import {abi, contractAddress} from "../../lib/constants/constants.js";
    import {provider} from "../../lib/stores/providerStore.js";

    let eventId = 0;
    let tickedId = 0;
    let saltCode = 0;
    let timePeriod = getCode();
    let refreshInterval;
    let progress = 0;
    let ticketData = {};
    $: hash = seedrandom(timePeriod.toString() + '_' + eventId + ' ' + tickedId + '_' + saltCode)()

    onMount(async () => {
        console.log($page)
        eventId = $page.url.searchParams.get('e')
        tickedId = $page.url.searchParams.get('t')
        saltCode = $page.url.searchParams.get('s')
        refreshInterval = setInterval(async () => {
            timePeriod = getCode();
            progress = calculateProgress(timePeriod);
            console.log(Math.trunc(hash * 10000))
        }, 1000);
        ticketData = await getTicketData(eventId, tickedId, contractAddress, abi, $provider);
    })

    onDestroy(() => {
        clearInterval(refreshInterval);
    })

    function calculateProgress(timePeriod) {
        console.log('time period is: ', timePeriod)
        const unix = moment().unix();
        console.log('unix is: ', unix)
        const diff = timePeriod - moment().toDate().getTime()
        console.log('diff is: ', diff);
        const progress = 1 - (diff / 30 / 1000);
        return progress;
    }

    function getCode() {
        const date = moment();
        const code = round(date, moment.duration(30, 'seconds'), 'ceil')
        return code;
    }

    function round(date, duration, method) {
        return moment(Math[method]((+date) / (+duration)) * (+duration));
    }
</script>