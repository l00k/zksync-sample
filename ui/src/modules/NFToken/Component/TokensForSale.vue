<template>
    <ui-block
        v-if="contract"
        title="Tokens for sale"
    >
        <TokensList
            :contract="contract"
            :account="contract.address"
            :sales="true"
        />
    </ui-block>
</template>

<script lang="ts">
import TokensList from '#/NFToken/Component/TokensList.vue';
import BaseComponent from '@inti5/app-frontend/Component/BaseComponent.vue';
import { Component } from '@inti5/app-frontend/Vue/Annotations';
import { Prop } from 'vue-property-decorator';
import { Contract } from 'zksync-web3';


@Component({
    components: {
        TokensList
    }
})
export default class TokensForSale
    extends BaseComponent
{

    @Prop()
    public contract : Contract;

}
</script>
