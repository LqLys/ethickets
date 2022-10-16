<Item style="height: 80px; margin-bottom: 5px; padding: 0px;">
    <Card style="width: 100%">
        <Actions>
            {#if $selectedAccount.toLowerCase() !== ticketData.owner.toLowerCase()}
                <ActionButtons style="width: 100%">
                    <span style="font-weight: 700">Price: </span>
                    <div style="width: 100%; text-align: center; font-weight: 700">
                        {displayPrice}
                    </div>
                    <Button on:click={() => buyFn(ticketData.id, price)}>
                        <Label>Buy</Label>
                    </Button>

                </ActionButtons>
            {/if}
            <div>

            </div>
            <ActionIcons>
                {#if $selectedAccount.toLowerCase() === ticketData.owner.toLowerCase()}

                    <FormField>
                        <Checkbox bind:checked touch/>
                        <span slot="label" style="white-space: nowrap; padding-right: 10px">For Sale</span>
                    </FormField>

                    <Textfield value={displayPrice} on:input={e => price = asWei(e.target.value)} type="text"
                               label="Price"
                               style="width: 100%;"
                               variant="outlined">
                    </Textfield>
                    <Button on:click={() => editFn(ticketData.id, checked, price)}>
                        <Label>Save</Label>
                    </Button>
                    <Button on:click={() => lockInFn(ticketData.id)}>
                        <Label style="white-space: nowrap">Lock in</Label>
                    </Button>
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
    import {Item,} from '@smui/list';
    import {onMount} from "svelte";
    import {selectedAccount} from "../lib/stores/selectedAccountStore.js";
    import Card, {ActionButtons, ActionIcons, Actions,} from '@smui/card';
    import Checkbox from '@smui/checkbox';
    import FormField from '@smui/form-field';
    import {selectedUnitPrice} from "../lib/stores/unitPriceStore.js";
    import {asWei, formatDisplayPrice} from "../lib/clients/utils.js";

    import Button, {Label} from '@smui/button';
    import Textfield from '@smui/textfield';
    import {weiToEther} from "../lib/clients/utils";


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


</script>