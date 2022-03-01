<template>
    <UiBlock
        v-if="contract"
        title="Tokens for sale"
    >
        <TokensList
            :account="contract.address"
            :sales="true"
        />
    </UiBlock>
</template>

<script lang="ts">
import TokensList from '#/NFToken/Component/TokensList.vue';
import { BaseComponent } from '@inti5/app-frontend/Component';
import { Component } from '@inti5/app-frontend/Vue/Annotations';
import * as Vue from 'vue-property-decorator';
import { Contract } from 'zksync-web3';


@Component({
    components: {
        TokensList
    }
})
export default class TokensForSale
    extends BaseComponent
{

    @Vue.InjectReactive('contract')
    public contract : Contract;

}
</script>
