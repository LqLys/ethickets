


<div>
    <div>
        <LinearProgress {progress} {closed}/>
    </div>
    <div class="card-container">
        <Card>
            <div style="padding: 1rem; text-align: center" >
                <h2 class="mdc-typography--headline6" style="margin: 0; font-weight: 700">
                    {#if $selectedAccount?.toLowerCase() === ticketData?.owner?.toLowerCase()}
                        You own this ticket
                    {:else}
                        You don't own this ticket
                    {/if}
                </h2>
                <h3 class="mdc-typography--subtitle2" style="margin: 0; color: #888; padding-top: 10px">
                    {Math.trunc(hash * 10000)}
                </h3>
            </div>
            <PrimaryAction>
                <Media class="card-media-16x9" aspectRatio="16x9"  style="background-size: contain; background-image: url({mediaUrl})"/>
                <Content class="mdc-typography--body2" style="text-align: center">
                    Ticker owner: {ticketData?.owner}
                </Content>
            </PrimaryAction>
        </Card>
    </div>
</div>

<script>
    import {page} from "$app/stores";
    import {onDestroy, onMount} from "svelte";
    import Card, {
        Content,
        PrimaryAction,
        Media,
        MediaContent,
    } from '@smui/card';
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
    $: mediaUrl = $selectedAccount?.toLowerCase() === ticketData?.owner?.toLowerCase() ? '/img/happy-face.png' : '/img/sad-face.png'

    onMount(async () => {
        eventId = $page.url.searchParams.get('e')
        tickedId = $page.url.searchParams.get('t')
        saltCode = $page.url.searchParams.get('s')
        refreshInterval = setInterval(async () => {
            timePeriod = getCode();
            progress = calculateProgress(timePeriod);
        }, 100);
        ticketData = await getTicketData(eventId, tickedId, contractAddress, abi, $provider);
    })

    onDestroy(() => {
        clearInterval(refreshInterval);
    })

    function calculateProgress(timePeriod) {
        const diff = timePeriod - moment().toDate().getTime()
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