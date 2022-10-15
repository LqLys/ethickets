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

    function formatDisplayAccount(acc){
        const start = acc.slice(0, 10);
        const end = acc.slice(-8);
        return start + '...' + end;
    }
</script>
<svelte:window bind:innerWidth={innerWidth}/>

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
            <!--            <NavTitle>Fixed</NavTitle>-->
            <!--            <NavTitle>Fixed</NavTitle>-->
            <!--            <NavTitle>Fixed</NavTitle>-->
        </Section>
        <Section align="end" toolbar>
            {#if $selectedAccount}
                <div style="font-weight: 700">{displayAccount}</div>
            {/if}
            <!--                        <IconButton class="material-icons" aria-label="Download"-->
            <!--                        >file_download-->
            <!--                        </IconButton-->
            <!--                        >-->
            <!--                        <IconButton class="material-icons" aria-label="Print this page"-->
            <!--                        >print-->
            <!--                        </IconButton-->
            <!--                        >-->
            <!--                        <IconButton class="material-icons" aria-label="Bookmark this page"-->
            <!--                        >bookmark-->
            <!--                        </IconButton-->
            <!--                        >-->
        </Section>
    </Row>
</TopAppBar>
<AutoAdjust {topAppBar}>
    <!--&lt;!&ndash;    <LoremIpsum />&ndash;&gt;-->
    <!--    <img-->
    <!--            alt="Page content placeholder"-->
    <!--            src="/page-content.jpg"-->
    <!--            style="display: block; max-width: 100%; height: auto; margin: 1em auto;"-->
    <!--    />-->
</AutoAdjust>
{#if menuOpen && innerWidth <= 900}
    <div style="width: 100%; background-color: #ff3e00;">
        <List>
            <Item on:click={() => goto('/')} style="display: flex; justify-content: center; font-weight: 700; color: white">
                <Text>Home</Text>
            </Item>
            <Item on:click={() => goto('/events')} style="display: flex; justify-content: center; font-weight: 700; color: white">
                <Text>Events</Text>
            </Item>
            <Item on:click={() => goto('/verify')} style="display: flex; justify-content: center; font-weight: 700; color: white">
                <Text>Verify</Text>
            </Item>
        </List>
    </div>
{/if}
<!--{#if $selectedAccount}-->

<!--{/if}-->
<header>
    <!--    <div class="corner">-->
    <!--        <a href="https://kit.svelte.dev">-->
    <!--            <img src={logo} alt="SvelteKit"/>-->
    <!--        </a>-->
    <!--    </div>-->

    <!--    <nav>-->
    <!--   -->
    <!--    </nav>-->

    <!--    <div class="corner">-->
    <!--        <a href="https://github.com/sveltejs/kit">-->
    <!--            <img src={github} alt="GitHub"/>-->
    <!--        </a>-->
    <!--    </div>-->
</header>
<!--{#if $selectedAccount}-->
<!--    <div style="display: flex; justify-content: center; margin-top: 5px">-->
<!--        <Paper color="secondary" style="padding: 5px" elevation={30}>-->
<!--            &lt;!&ndash;            <Title>{$provider?.provider?.selectedAddress}</Title>&ndash;&gt;-->
<!--            <Content style="font-size: 0.8rem; font-weight: bolder">-->
<!--                {$selectedAccount}-->
<!--            </Content>-->
<!--        </Paper>-->
<!--    </div>-->
<!--{/if}-->
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

    /*li {*/
    /*    position: relative;*/
    /*    height: 100%;*/
    /*}*/

    /*li.active::before {*/
    /*    --size: 6px;*/
    /*    content: '';*/
    /*    width: 0;*/
    /*    height: 0;*/
    /*    position: absolute;*/
    /*    top: 0;*/
    /*    left: calc(50% - var(--size));*/
    /*    border: var(--size) solid transparent;*/
    /*    border-top: var(--size) solid var(--color-theme-1);*/
    /*}*/

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
