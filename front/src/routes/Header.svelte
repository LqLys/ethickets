<script>
    import {selectedAccount} from "../lib/stores/selectedAccountStore.js";
    import Paper, {Content} from '@smui/paper';
    import TopAppBar, {AutoAdjust, Row, Section, Title as NavTitle,} from '@smui/top-app-bar';
    import IconButton from '@smui/icon-button';
    // import LoremIpsum from '$lib/LoremIpsum.svelte';

    let topAppBar;
</script>
<TopAppBar style="background-color: #304a79" bind:this={topAppBar} variant="fixed">
    <Row>
        <Section>
            <IconButton class="material-icons">menu</IconButton>
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
            <!--            <NavTitle>Fixed</NavTitle>-->
            <!--            <NavTitle>Fixed</NavTitle>-->
            <!--            <NavTitle>Fixed</NavTitle>-->
        </Section>
        <Section align="end" toolbar>
            {#if $selectedAccount}
                <div style="font-weight: 700">{$selectedAccount}</div>
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
