<Item style="height: 120px; margin-bottom: 5px; padding: 0px">
    <Card style="width: 100%">
        <Content>Current price: {weiToEther(ticketData.price)}, is for sale : {ticketData.isForSale}</Content>
        <Actions>
            <ActionButtons>
                {#if $selectedAccount.toLowerCase() !== ticketData.owner.toLowerCase()}
                    <Button on:click={() => buyFn(ticketData.id, price)}>
                        <Label>Buy</Label>
                    </Button>
                {/if}
            </ActionButtons>
            <div>

            </div>
            <ActionIcons>
                {#if $selectedAccount.toLowerCase() === ticketData.owner.toLowerCase()}
                    <Button on:click={() => lockInFn(ticketData.id)}>
                        <Label style="white-space: nowrap">Lock in</Label>
                    </Button>
                    <Button on:click={() => editFn(ticketData.id, checked, price)}>
                        <Label>Edit</Label>
                    </Button>
                    <FormField>
                        <Checkbox bind:checked touch />
                        <span slot="label" style="white-space: nowrap; padding-right: 10px">for sale</span>
                    </FormField>

                    <Textfield value={displayPrice} on:input={e => price = e.target.value} type="number" label="Price"
                               style="width: 100%;"
                               variant="outlined">
                    </Textfield>
                {/if}
            </ActionIcons>
        </Actions>
    </Card>
    <!--                <Text style="margin-left: 10px">-->
    <!--                    <PrimaryText style="font-size: 1.5rem;">{item.price}</PrimaryText>-->
    <!--                    <SecondaryText style="margin-top: 5px; height: 100px">{item.owner}</SecondaryText>-->
    <!--                </Text>-->
    <!--                <Meta class="material-icons">info</Meta>-->
</Item>

<script>
    import List, {Item,} from '@smui/list';
    import {onMount} from "svelte";
    import {addTickets, buyTicket, getEventTickets} from "../lib/clients/ethicketsAbiClient.js";
    import {page} from "$app/stores";
    import {abi, contractAddress} from "../lib/constants/constants.js";
    import {provider} from "../lib/stores/providerStore.js";
    import {selectedAccount} from "../lib/stores/selectedAccountStore.js";
    import Card, {ActionButtons, ActionIcons, Actions, Content,} from '@smui/card';
    import Checkbox from '@smui/checkbox';
    import FormField from '@smui/form-field';
    import {selectedUnitPrice} from "../lib/stores/unitPriceStore.js";

    import Button, {Label} from '@smui/button';
    import Textfield from '@smui/textfield';
    import {etherToWei, weiToEther} from "../lib/clients/utils";


    export let ticketData = {};
    export let buyFn;
    export let editFn;
    export let lockInFn;
    export let priceUnit


    let price = 0;
    $: displayPrice = formatDisplayPrice(price, $selectedUnitPrice);
    let checked = false;
    $: priceInEther = weiToEther(price.toString());


    onMount(async () => {
        price = ticketData.price;
        checked = ticketData.isForSale;
    })

    function formatDisplayPrice(price, unit){
        if(unit !== 'Wei'){
            return weiToEther(price)
        }
        return price;
    }

</script>