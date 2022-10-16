<script>
    import Card, {ActionButtons, ActionIcons, Actions, Content, Media, PrimaryAction,} from '@smui/card';
    import Button, {Label} from '@smui/button';
    import IconButton, {Icon} from '@smui/icon-button';
    import moment from 'moment';
    import {createEventDispatcher, onDestroy, onMount, tick} from "svelte";
    import LinearProgress from '@smui/linear-progress';

    import {page} from "$app/stores";
    import seedrandom from "seedrandom"
    import QRCode from 'qrcode';
    import {selectedAccount} from "../lib/stores/selectedAccountStore.js";
    import {abi, contractAddress} from "../lib/constants/constants.js";
    import Textfield from "@smui/textfield";
    import {canVerify, editEventData} from "../lib/clients/ethicketsAbiClient.js";
    import {provider} from "../lib/stores/providerStore.js";
    import Accordion, {Content as PanelContent, Header, Panel} from '@smui-extra/accordion';

    export let event;
    const changeTabDispatcher = createEventDispatcher();
    let isVerifier;
    $: ver = $selectedAccount
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

    $: {
        console.log(verifyUrl)
    }

    let editEventInfoOpen = false;
    let verifyTicketOpen = false;

    $: hash = seedrandom(timePeriod.toString() + '_' + $page.params.id + ' ' + ticketId + '_' + saltCode)()
    $: {
        canVerify($page.params.id, $selectedAccount, contractAddress, abi, $provider)
            .then(res => {
                isVerifier = res;
            })
    }

    onMount(async () => {
        await tick();

        refreshInterval = setInterval(async () => {
            verifyUrl = $page.url.origin + `/verify?e=${$page.params.id}&t=${ticketId}&s=${saltCode}`
            timePeriod = getCode();
            qrcode = await generateQR(verifyUrl)
            progress = calculateProgress(timePeriod);
        }, 100);
        isVerifier = await canVerify($page.params.id, $selectedAccount, contractAddress, abi, $provider)
        eventName = event?.name;
        eventDescription = event?.description;
        const tm = new Date(event?.dateTime?.toNumber())?.toISOString().substring(0, 16);
        eventDate = tm;
        eventLocation = event?.location;
        imgUrl = event?.imgUrl;
    })

    onDestroy(async () => {
        clearInterval(refreshInterval);
    })

    function changeTab() {
        changeTabDispatcher('changeTab', {
            tabName: 'Tickets'
        });
    }

    async function handleEventUpdate() {
        const timestamp = new Date(eventDate).getTime();
        await editEventData(event.id, eventName, eventDescription, timestamp, eventLocation, imgUrl, contractAddress, abi, $provider)
    }

    function calculateProgress(timePeriod) {
        const diff = timePeriod - moment().toDate().getTime()
        return 1 - (diff / 30 / 1000);
    }

    const generateQR = async text => {
        if (text) {
            try {
                return await QRCode.toDataURL(text);
            } catch (err) {
                console.error(err)
            }
        }
    }

    function getCode() {
        const date = moment();
        return round(date, moment.duration(30, 'seconds'), 'ceil');
    }

    function round(date, duration, method) {
        return moment(Math[method]((+date) / (+duration)) * (+duration));
    }
</script>

<Card>
    <PrimaryAction>
        <Media style="{eventStyles}" class="card-media-16x9" aspectRatio="16x9"/>
        <Content class="mdc-typography--body2">
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
                    toggle
                    aria-label="Add to favorites"
                    title="Add to favorites"
            >
                <Icon class="material-icons" on>favorite</Icon>
                <Icon class="material-icons">favorite_border</Icon>
            </IconButton>
            <IconButton
                    class="material-icons"
                    title="Share">share
            </IconButton
            >
            <IconButton
                    class="material-icons"
                    title="More options">more_vert
            </IconButton
            >
        </ActionIcons>
    </Actions>
</Card>

<div class="accordion-container">
    <Accordion multiple>
        {#if $selectedAccount.toLowerCase() === event?.owner?.toLowerCase()}
            <Panel bind:open={editEventInfoOpen}>
                <Header style="text-align: center">
                    <span>Edit Event Info</span>
                    <IconButton slot="icon" toggle pressed={editEventInfoOpen}>
                        <Icon class="material-icons" on>expand_less</Icon>
                        <Icon class="material-icons">expand_more</Icon>
                    </IconButton>
                </Header>
                <PanelContent>
                    <div>
                        <div style="width: 100%; padding-bottom: 10px">
                            <Textfield bind:value={eventName} label="Name" style="width: 100%;" variant="outlined">
                            </Textfield>
                        </div>
                        <div style="width: 100%; padding-bottom: 10px">
                            <Textfield bind:value={eventLocation} label="Location" style="width: 100%;"
                                       variant="outlined">
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
            <Panel bind:open={verifyTicketOpen}>
                <Header style="text-align: center">
                    Ticket Verification
                    <IconButton slot="icon" toggle pressed={verifyTicketOpen}>
                        <Icon class="material-icons" on>expand_less</Icon>
                        <Icon class="material-icons">expand_more</Icon>
                    </IconButton>
                </Header>
                <PanelContent>
                    <div style="width: 100%; padding-bottom: 10px">
                        <Textfield bind:value={ticketId} label="Ticket number" style="width: 100%;" variant="outlined">
                        </Textfield>
                    </div>
                    <div style="width: 100%; padding-bottom: 10px">
                        <Textfield bind:value={saltCode} label="Verification Code" style="width: 100%;"
                                   variant="outlined">
                        </Textfield>
                    </div>
                    <div>
                        <LinearProgress {progress} {closed}/>
                    </div>
                    <div style="display: flex; justify-content: center; flex-direction: column; align-items: center; padding-top: 10px; font-weight: 900">
                        <div style="font-size: 2rem; font-family: Roboto sans-serif">{Math.trunc(hash * 10000)}</div>
                        <div><img src="{qrcode}" alt="QR code" style="height: 200px; width: 200px"/></div>
                        <a href="{verifyUrl}" style="color: #ff3e00">Verify</a>
                    </div>
                </PanelContent>
            </Panel>
        {/if}
    </Accordion>
</div>







