<template>
    <div>
        <div v-if="isLoading && !tokens.length">
            <b-skeleton :animated="true" width="100%" height="100px" />
        </div>

        <div class="is-flex is-justify-content-start mb-6">
            <div
                v-for="tokenWrap in tokens"
                :key="tokenWrap.tokenId"
                class="is-flex is-flex-direction-column mr-4 mb-4"
            >
                <TokenPreview
                    :token="tokenWrap.token"
                    :price="tokenWrap.price"
                />

                <b-button
                    type="is-success"
                    class="mt-2"
                    :loading="tokenWrap.buying"
                    :disabled="tokenWrap.buying"
                    @click="buyToken(tokenWrap)"
                >
                    Buy
                </b-button>
            </div>
        </div>

        <b-pagination
            v-model="currentPage"
            :total="total"
            :per-page="20"
        >
        </b-pagination>
    </div>
</template>

<script lang="ts">
import TokenPreview from '#/NFToken/Component/TokenPreview.vue';
import { NftToken } from '#/NFToken/Domain/Model/NftToken';
import { NftTokenWrap } from '#/NFToken/Domain/Model/NftTokenWrap';
import BaseComponent from '@inti5/app-frontend/Component/BaseComponent.vue';
import { Component } from '@inti5/app-frontend/Vue/Annotations';
import { BigNumber, ethers } from 'ethers';
import { Prop } from 'vue-property-decorator';
import { Contract } from 'zksync-web3';


@Component({
    components: {
        TokenPreview,
    }
})
export default class TokensList
    extends BaseComponent
{

    @Prop()
    public contract : Contract;

    @Prop()
    public account : string;

    @Prop({ default: false })
    public sales : boolean;

    public isLoading : boolean = false;

    public itemsPerPage : number = 20;
    public currentPage : number = 1;

    public total : number = 0;

    public tokensOfPage : { [page : number] : NftTokenWrap[] } = {};
    public tokens : NftTokenWrap[] = [];
    public prices : string[] = [];


    public async mounted ()
    {
        this.loadTokens();
    }

    public async loadTokens ()
    {
        this.isLoading = true;

        const totalBn : BigNumber = await this.contract.totalSupply();
        this.total = totalBn.toNumber();

        if (!this.tokensOfPage[this.currentPage]) {
            this.tokensOfPage[this.currentPage] = [];

            const offset = (this.currentPage - 1) * this.itemsPerPage;
            const limit = Math.min(this.total - offset, this.itemsPerPage);

            for (let i = 0; i < limit; ++i) {
                try {
                    const tokenId : BigNumber = await this.contract.tokenByIndex(offset + i);
                    const token : NftToken = await this.contract.tokens(tokenId);

                    const tokenWrap : NftTokenWrap = {
                        tokenId: tokenId.toNumber(),
                        token,
                    }

                    this.tokensOfPage[this.currentPage].push(tokenWrap);

                    if (this.sales) {
                        const price = await this.contract.tokenPrice(tokenId);
                        const priceFormated = ethers.utils.formatUnits(price, 18);

                        tokenWrap.price = priceFormated;
                    }
                }
                catch (e) {
                    console.log(e);
                    break;
                }
            }

            this.tokens = this.tokensOfPage[this.currentPage];
        }

        this.isLoading = false;
    }

    public async buyToken(tokenWrap : NftTokenWrap)
    {
        this.$set(tokenWrap, 'buying', true);



        this.$set(tokenWrap, 'buying', false);
    }

}
</script>

<style scoped lang="scss">
.field {
    margin-bottom: 1.5rem;
}
</style>
