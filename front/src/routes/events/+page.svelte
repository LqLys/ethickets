<div>
    <TabBar tabs={['Your Events']} let:tab bind:active>
        <Tab {tab}>
            <TabLabel>{tab}</TabLabel>
        </Tab>
    </TabBar>
    {#if active === 'Your Events'}
        <UserEvents/>
    {/if}
</div>

<script>
    import Tab, {Label as TabLabel,} from '@smui/tab';
    import TabBar from '@smui/tab-bar';
    import UserEvents from "../UserEvents.svelte";

    let active = 'Your Events';
</script>