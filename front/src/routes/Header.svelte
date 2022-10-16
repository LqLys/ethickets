<script>
    import {selectedAccount} from "../lib/stores/selectedAccountStore.js";
    import TopAppBar, {AutoAdjust, Row, Section, Title as NavTitle,} from '@smui/top-app-bar';
    import List, {Item, Text} from '@smui/list';
    import IconButton from "@smui/icon-button";
    import {goto} from "$app/navigation";


    let innerWidth = 0;
    let topAppBar;
    let menuOpen = false;
    let menu;
    let clicked;
    $: displayAccount = innerWidth > 700 ? $selectedAccount : formatDisplayAccount($selectedAccount);

    function formatDisplayAccount(acc) {
        const start = acc.slice(0, 10);
        const end = acc.slice(-8);
        return start + '...' + end;
    }
</script>
<svelte:window bind:innerWidth={innerWidth}/>
<header>
    <TopAppBar style="background-color: #304a79" bind:this={topAppBar} variant="static">

        <Row>
            <Section>
                {#if innerWidth <= 500  }
                    <div>
                        <IconButton on:click={() => menuOpen = !menuOpen} class="material-icons">menu</IconButton>
                    </div>
                {/if}
                {#if innerWidth > 500}
                    <ul>
                        <NavTitle>
                            <a href="/">Home</a>
                        </NavTitle>
                        <NavTitle>
                            <a href="/events">Events</a>
                        </NavTitle>
                        <NavTitle>
                            <a href="/verify">Verify</a>
                        </NavTitle>
                    </ul>
                {/if}
            </Section>
            <Section align="end" toolbar>
                {#if $selectedAccount}
                    <div style="font-weight: 700">{displayAccount}</div>
                {/if}
            </Section>
        </Row>
    </TopAppBar>
    <AutoAdjust {topAppBar}></AutoAdjust>
    {#if menuOpen && innerWidth <= 900}
        <div style="width: 100%; background-color: #ff3e00;">
            <List>
                <Item on:click={() => goto('/')}
                      style="display: flex; justify-content: center; font-weight: 700; color: white">
                    <Text>Home</Text>
                </Item>
                <Item on:click={() => goto('/events')}
                      style="display: flex; justify-content: center; font-weight: 700; color: white">
                    <Text>Events</Text>
                </Item>
                <Item on:click={() => goto('/verify')}
                      style="display: flex; justify-content: center; font-weight: 700; color: white">
                    <Text>Verify</Text>
                </Item>
            </List>
        </div>
    {/if}
</header>

<style>
    header {
        display: flex;
        justify-content: space-between;
    }

    .corner {
        width: 3em;
        height: 3em;
    }

    .corner a {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
    }

    .corner img {
        width: 2em;
        height: 2em;
        object-fit: contain;
    }

    nav {
        display: flex;
        justify-content: center;
        --background: rgba(255, 255, 255, 0.7);
    }

    svg {
        width: 2em;
        height: 3em;
        display: block;
    }

    path {
        fill: var(--background);
    }

    ul {
        position: relative;
        padding: 0;
        margin: 0;
        height: 3em;
        display: flex;
        justify-content: center;
        align-items: center;
        list-style: none;
        background: var(--background);
        background-size: contain;
    }
    a {
        color: var(--color-theme-1);
    }

    a:hover {
        color: var(--color-theme-1);
    }

    /* Hide everything above this component. */
    :global(app),
    :global(body),
    :global(html) {
        display: block !important;
        height: auto !important;
        width: auto !important;
        position: static !important;
    }
</style>
