<script>
    import Card, {ActionButtons, ActionIcons, Actions, Content, Media, PrimaryAction,} from '@smui/card';
    import Button, {Label} from '@smui/button';
    import IconButton, {Icon} from '@smui/icon-button';
    import Textfield from '@smui/textfield';
    import moment from 'moment';
    import {onDestroy, onMount, tick} from "svelte";
    import LinearProgress from '@smui/linear-progress';

    import {page} from "$app/stores";
    import seedrandom from "seedrandom"
    import QRCode from 'qrcode';

    let clicked = 0;
    export let event;
    $: eventStyles = `background-image: url(${event?.imgUrl});`;

    let eventName = '';
    let eventDescription = '';
    let eventDate = '';
    let eventLocation = '';
    let imgUrl = '';
    let qrcode = '';

    let timePeriod = getCode();
    let encoded = seedrandom(timePeriod.toString())();
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
        const path = $page.url.href
        console.log('url')
        console.log($page)
        refreshInterval = setInterval(async () => {
            verifyUrl = $page.url.origin + `/verify?e=${$page.params.id}&t=${ticketId}&s=${saltCode}`
            timePeriod = getCode();
            encoded = seedrandom(timePeriod.toString())();
            qrcode =  await generateQR(verifyUrl)
            const pro = calculateProgress(timePeriod);
            console.log('pro')
            console.log(pro)
            progress = calculateProgress(timePeriod);



        }, 1000);
    })

    onDestroy(async ()=> {
        clearInterval(refreshInterval);
    })

    function handleEventUpdate() {

    }

    function calculateProgress(timePeriod){
        console.log('time period is: ', timePeriod)
        const unix = moment().unix();
        console.log('unix is: ', unix)
        const diff = timePeriod - moment().toDate().getTime()
        console.log('diff is: ', diff);
        const progress = 1 - (diff/30/1000);
        return progress;
    }

    const generateQR = async text => {
        if(text) {
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
            <Button on:click={() => clicked++}>
                <Label>Action</Label>
            </Button>
            <Button on:click={() => clicked++}>
                <Label>Another</Label>
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
<h1>verify</h1>
<div style="width: 100%; padding-bottom: 10px">
    <Textfield bind:value={ticketId} label="Ticket number" style="width: 100%;" variant="outlined">
    </Textfield>
</div>
<div style="width: 100%; padding-bottom: 10px">
    <Textfield bind:value={saltCode} label="Verification Code" style="width: 100%;" variant="outlined">
    </Textfield>
</div>
<div>
    <LinearProgress {progress} {closed} />
</div>
<img src="{qrcode}" style="height: 100px; width: 100px"/>
<a href="{verifyUrl}">Verify</a>
<div>
    {Math.trunc(hash * 10000)}
</div>
<!--<canvas bind:this={canvas} id="canvas"></canvas>-->