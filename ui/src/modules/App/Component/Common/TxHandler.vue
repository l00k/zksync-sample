<template>
    <div class="tx-handler">
        <div
            v-if="!isReady"
            class="placeholder"
        >
            <b-skeleton :animated="true" height="100px" />
            <b-skeleton :animated="true" width="60%"/>
        </div>

        <validate-observer
            v-if="isReady"
            v-slot="{ handleSubmit, invalid }"
        >
            <form
                @submit.prevent="handleSubmit(onSubmit)"
            >
                <slot></slot>

                <div class="columns mt-4">
                    <div class="column is-6">

                        <b-field
                            label="Fee token"
                            label-position="on-border"
                            :style="{ margin: 0 }"
                        >
                            <b-select
                                v-model="selectedFeeToken"
                                @input="onSelectedFeeTokenChange"
                            >
                                <option
                                    v-for="feeToken in feeTokens"
                                    :key="feeToken.address"
                                    :value="feeToken"
                                >
                                    {{ feeToken.name }} ({{ feeToken.symbol }})
                                </option>
                            </b-select>
                        </b-field>

                        <div class="ml-1 mt-2 has-color-gray has-font-size-sm">
                            Fee: {{ feeAmount ?? '-' }} {{ selectedFeeToken.symbol }}
                        </div>

                    </div>
                    <div class="column is-6 has-text-right">
                        <b-button
                            native-type="submit"
                            type="is-primary"
                            :loading="isReloading || isProcessing"
                            :disabled="isReloading || isProcessing || invalid"
                            class="is-inline-block"
                        >Submit
                        </b-button>
                    </div>
                </div>
            </form>
        </validate-observer>
    </div>
</template>

<script lang="ts">
import { FeeToken } from '#/App/Domain/Model/FeeToken';
import { DappProvider } from '#/App/Service/DappProvider';
import { Inject } from '@/core/inti5/object-manager';
import { Component } from '@inti5/app-frontend/Vue/Annotations';
import { ethers } from 'ethers';
import { Prop, Vue, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { Contract } from 'zksync-web3';


const MetaMaskStore = namespace('MetaMask');
const RuntimeStorage = namespace('RuntimeStorage');


@Component()
export default class Jdenticon
    extends Vue
{

    @Inject()
    public dappProvider : DappProvider;

    @Prop()
    public contract : Contract;

    @Prop()
    public endpoint : string;

    @Prop()
    public args : any[];


    @RuntimeStorage.State('feeTokens')
    public feeTokens : FeeToken[];

    public feeAmounts : { [symbol : string] : string } = {};


    public isReady : boolean = false;
    public isReloading : boolean = false;
    public isProcessing : boolean = false;

    public selectedFeeToken : FeeToken;
    public feeAmount : string = null;


    public async mounted()
    {
        await this.$store.dispatch('RuntimeStorage/init');
        this.isReady = true;

        this.selectedFeeToken = this.feeTokens[0];

        await this.loadFeesAndBalances();
    }

    protected async loadFeesAndBalances ()
    {
        this.isReloading = true;

        this.feeAmounts = {};
        for (const token of this.feeTokens) {
            const feeInGas = await this.contract.estimateGas.mintForSale(...this.args);
            const gasPriceInUnits = await this.dappProvider.provider.getGasPrice();

            this.$set(
                this.feeAmounts,
                token.symbol,
                ethers.utils.formatUnits(feeInGas.mul(gasPriceInUnits), token.decimals)
            );
        }

        this.onSelectedFeeTokenChange(this.selectedFeeToken);

        this.isReloading = false;
    }

    @Watch('selectedFeeToken')
    protected onSelectedFeeTokenChange(token : FeeToken)
    {
        this.feeAmount = this.feeAmounts[token.symbol];
    }

    protected async onSubmit ()
    {
        this.isProcessing = true;

        try {
            this.$buefy.snackbar.open({
                message: 'Signing transaction',
                type: 'is-info',
                position: 'is-bottom-right',
            });

            const txHandle = await this.contract.mintForSale(
                ...this.args,
                {
                    customData: {
                        feeToken: this.selectedFeeToken.address
                    }
                }
            );

            this.$buefy.snackbar.open({
                message: 'Transaction sent. Waiting until the transaction is committed',
                type: 'is-info',
                position: 'is-bottom-right',
            });

            await txHandle.wait();

            this.$buefy.snackbar.open({
                message: 'Transaction committed',
                type: 'is-success',
                position: 'is-bottom-right',
            });
        }
        catch (e : any) {
            this.$buefy.snackbar.open({
                message: e.message,
                type: 'is-danger',
                position: 'is-bottom-right',
            });
        }

        this.isProcessing = false;
    }

}
</script>
