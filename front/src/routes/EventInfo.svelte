<script>
    import Card, {
        Content,
        PrimaryAction,
        Media,
        MediaContent,
        Actions,
        ActionButtons,
        ActionIcons,
    } from '@smui/card';
    import Button, { Label } from '@smui/button';
    import IconButton, { Icon } from '@smui/icon-button';
    import Textfield from '@smui/textfield';

    let clicked = 0;
    export let event;
    $: eventStyles = `background-image: url(${event?.imgUrl});`;

    let eventName = '';
    let eventDescription = '';
    let eventDate = '';
    let eventLocation = '';
    let imgUrl = '';


    function handleEventUpdate(){

    }
</script>

<style>

</style>

<Card >
    <PrimaryAction on:click={() => clicked++}>
        <Media style="{eventStyles}" class="card-media-16x9" aspectRatio="16x9" />
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
                    title="Share">share</IconButton
            >
            <IconButton
                    class="material-icons"
                    on:click={() => clicked++}
                    title="More options">more_vert</IconButton
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