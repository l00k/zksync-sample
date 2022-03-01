<template>
    <div class="token-controller">
        <TokenPreview
            :token="tokenWrap.token"
        />

        <div class="is-flex is-flex-direction-column">
            <b-taglist
                v-if="price"
                attached

                class="mt-2 mb-0 is-flex"
            >
                <b-tag type="is-white" class="is-flex-grow-1">Price</b-tag>
                <b-tag type="is-info" class="is-flex-grow-1">{{ price | formatCoin('0.00(0)') }}</b-tag>
                <b-tag type="is-white">ETH</b-tag>
            </b-taglist>

            <b-button
                type="is-success"
                :loading="isLoading || isBuying"
                :disabled="isLoading || isBuying"
                @click="startBuying()"
            >
                Buy
            </b-button>
        </div>

        <div
            v-if="isBuying"
        >
            <UiModal
                ref="buyingModal"
                :has-modal-card="true"
                @close="onBuyingModalClose"
            >
                <UiBlock
                    title="Buy token"
                    class="is-relative"
                    :style="{ maxWidth: '90vw' }"
                >
                    <div class="columns">
                        <div class="column is-narrow">
                            <TokenPreview
                                :token="tokenWrap.token"
                            />
                        </div>
                        <div class="column">
                            <TxHandler
                                endpoint="buy"
                                :args="[ tokenWrap.tokenId, rawPrice ]"
                                submitText="Buy"
                            >
                                Price: {{ price | formatCoin('0.0000') }} ETH
                            </TxHandler>
                        </div>
                    </div>
                </UiBlock>
            </UiModal>
        </div>
    </div>
</template>

<script lang="ts">
import { Jdenticon, TxHandler } from '#/App/Component';
import * as Utility from '#/App/Utility';
import TokenPreview from '#/NFToken/Component/TokenPreview.vue';
import { NftTokenWrap } from '#/NFToken/Domain/Model/NftTokenWrap';
import { BaseComponent, UiModal } from '@inti5/app-frontend/Component';
import { Component } from '@inti5/app-frontend/Vue/Annotations';
import Decimal from 'decimal.js';
import { BigNumber } from 'ethers';
import * as Vue from 'vue-property-decorator';
import { Contract } from 'zksync-web3';
import { ethers } from 'ethers';


@Component({
    components: {
        TxHandler,
        TokenPreview,
        Jdenticon
    }
})
export default class TokenController
    extends BaseComponent
{

    @Vue.InjectReactive('contract')
    public contract : Contract;

    @Vue.Prop()
    public tokenWrap : NftTokenWrap;

    @Vue.Ref()
    public buyingModal : UiModal;


    public isForSale : boolean;

    public rawPrice : BigNumber;
    public price : Decimal = new Decimal(0);

    public isLoading : boolean = false;
    public isBuying : boolean = false;


    public mounted ()
    {
        this.load();
    }

    @Vue.Watch('token', { deep: true })
    public async load ()
    {
        this.isLoading = true;

        try {
            this.isForSale = await this.contract.isForSale(this.tokenWrap.tokenId);
            if (this.isForSale) {
                const rawPrice = await this.contract.tokenPrice(this.tokenWrap.tokenId);

                this.rawPrice = rawPrice;
                this.price = Utility.parseRawCoin(rawPrice, 18);
            }
        }
        catch (e) {
        }

        this.isLoading = false;
    }

    public async startBuying ()
    {
        this.isBuying = true;

        this.$nextTick(() => {
            this.buyingModal.show();
        });
    }

    public onBuyingModalClose ()
    {
        this.isBuying = false;
    }

}
</script>
