<script>
    import Card, {ActionButtons, ActionIcons, Actions, Content, Media, PrimaryAction,} from '@smui/card';
    import Button, {Label} from '@smui/button';
    import IconButton, {Icon} from '@smui/icon-button';
    import moment from 'moment';
    import {afterUpdate, createEventDispatcher, onDestroy, onMount, tick} from "svelte";
    import LinearProgress from '@smui/linear-progress';

    import {page} from "$app/stores";
    import seedrandom from "seedrandom"
    import QRCode from 'qrcode';
    import {selectedAccount} from "../lib/stores/selectedAccountStore.js";
    import {abi, contractAddress} from "../lib/constants/constants.js";
    // import {provider} from "../lib/stores/providerStore.js";
    import Textfield from "@smui/textfield";
    import {canVerify} from "../lib/clients/ethicketsAbiClient.js";
    import {provider} from "../lib/stores/providerStore.js";
    import Accordion, { Panel, Header, Content as PanelContent } from '@smui-extra/accordion';

    let clicked = 0;
    export let event;
    const changeTabDispatcher = createEventDispatcher();
    let isVerifier;
    $: eventStyles = `background-image: url(${event?.imgUrl});`;

    let eventName = '';
    let eventDescription = '';
    let eventDate = '';
    let eventLocation = '';
    let imgUrl = '';
    let qrcode = '';

    let timePeriod = getCode();
    let canvas;
    let refreshInterval;
    let progress = 0;
    let closed = false

    let ticketId = 0;
    let saltCode = 0;
    let verifyUrl;

    $: hash = seedrandom(timePeriod.toString() + '_' + $page.params.id + ' ' + ticketId + '_' + saltCode)()


    onMount(async () => {
        await tick();
        refreshInterval = setInterval(async () => {
            verifyUrl = $page.url.origin + `/verify?e=${$page.params.id}&t=${ticketId}&s=${saltCode}`
            timePeriod = getCode();
            qrcode = await generateQR(verifyUrl)
            progress = calculateProgress(timePeriod);
        }, 100);
        isVerifier = await canVerify($page.params.id, $selectedAccount, contractAddress, abi, $provider)
    })

    onDestroy(async () => {
        clearInterval(refreshInterval);
    })

    function changeTab(){
        changeTabDispatcher('changeTab', {
            tabName: 'Tickets'
        });
    }

    function handleEventUpdate() {

    }

    function calculateProgress(timePeriod) {
        const diff = timePeriod - moment().toDate().getTime()
        const progress = 1 - (diff / 30 / 1000);
        return progress;
    }

    const generateQR = async text => {
        if (text) {
            try {
                const qr = await QRCode.toDataURL(text);
                return qr;
            } catch (err) {
                console.error(err)
            }
        }
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

<style>

</style>


<Card>
    <PrimaryAction on:click={() => clicked++}>
        <Media style="{eventStyles}" class="card-media-16x9" aspectRatio="16x9"/>
        <Content class="mdc-typography--body2">
            <!--            <h2 class="mdc-typography&#45;&#45;headline6" style="margin: 0;">-->
            <!--                A card with media.-->
            <!--            </h2>-->
            <h3
                    class="mdc-typography--subtitle2"
                    style="margin: 0 0 10px; color: #888;"
            >
                {event?.name}.
            </h3>
            {event?.description}
        </Content>
    </PrimaryAction>
    <Actions>
        <ActionButtons>
            <Button on:click={changeTab}>
                <Label>Buy ticket</Label>
            </Button>

        </ActionButtons>
        <ActionIcons>
            <IconButton
                    on:click={() => clicked++}
                    toggle
                    aria-label="Add to favorites"
                    title="Add to favorites"
            >
                <Icon class="material-icons" on>favorite</Icon>
                <Icon class="material-icons">favorite_border</Icon>
            </IconButton>
            <IconButton
                    class="material-icons"
                    on:click={() => clicked++}
                    title="Share">share
            </IconButton
            >
            <IconButton
                    class="material-icons"
                    on:click={() => clicked++}
                    title="More options">more_vert
            </IconButton
            >
        </ActionIcons>
    </Actions>
</Card>

<div class="accordion-container">
    <Accordion multiple>
        {#if $selectedAccount.toLowerCase() === event?.owner?.toLowerCase()}
        <Panel>
            <Header style="text-align: center">Edit Event Info</Header>
            <PanelContent>
                <div>
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
                            <Label>Edit Event</Label>
                        </Button>
                    </div>
                </div>
            </PanelContent>
        </Panel>
        {/if}
        {#if isVerifier}
        <Panel>
            <Header style="text-align: center">Ticket Verification</Header>
            <PanelContent>
                <div style="width: 100%; padding-bottom: 10px">
                    <Textfield bind:value={ticketId} label="Ticket number" style="width: 100%;" variant="outlined">
                    </Textfield>
                </div>
                <div style="width: 100%; padding-bottom: 10px">
                    <Textfield bind:value={saltCode} label="Verification Code" style="width: 100%;" variant="outlined">
                    </Textfield>
                </div>
                <div>
                    <LinearProgress {progress} {closed}/>
                </div>
                <div style="display: flex; justify-content: center; flex-direction: column; align-items: center; padding-top: 10px; font-weight: 900">
                    <div style="font-size: 2rem; font-family: Roboto sans-serif">{Math.trunc(hash * 10000)}</div>
                    <div><img src="{qrcode}" style="height: 200px; width: 200px"/></div>
                    <a href="{verifyUrl}">Verify</a>
                </div>



            </PanelContent>
        </Panel>
        {/if}
    </Accordion>
</div>







