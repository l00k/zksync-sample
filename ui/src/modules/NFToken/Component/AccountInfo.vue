<template>
    <div
        class="panel is-primary"
        :style="{ height: '100%' }"
    >
        <header class="panel-heading">
            <div class="panel-heading-title is-justify-content-space-between">
                <span>
                    Account info
                </span>
            </div>
        </header>
        <div
            class="panel-block is-relative"
            :style="{ height: 'calc(100% - 31.5px)' }"
        >
            <b-loading
                :active="!isReady"
                :is-full-page="false"
            ></b-loading>

            <div>
                <div class="is-flex is-align-items-center">
                    <Jdenticon
                        :value="activeAccount"
                        class="account-icon mr-3"
                    />
                    {{ activeAccount }}
                </div>

                <div
                    class="mt-2"
                >
                    <b-tag
                        v-if="isOwner"
                        type="is-success"
                    >OWNER
                    </b-tag>
                </div>
            </div>

        </div>
    </div>
</template>

<script lang="ts">
import Jdenticon from '#/App/Component/Common/Jdenticon.vue';
import { FeeToken } from '#/App/Domain/Model/FeeToken';
import { DappProvider } from '#/App/Service/DappProvider';
import BaseComponent from '@inti5/app-frontend/Component/BaseComponent.vue';
import { Component } from '@inti5/app-frontend/Vue/Annotations';
import { Inject } from '@inti5/object-manager';
import { ethers } from 'ethers';
import { Prop, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { Contract } from 'zksync-web3';


const MetaMaskStore = namespace('MetaMask');
const RuntimeStorage = namespace('RuntimeStorage');


type Balance = {
    token : FeeToken,
    balance : string,
}


@Component({
    components: {
        Jdenticon
    }
})
export default class DappInfo
    extends BaseComponent
{

    @Inject()
    public dappProvider : DappProvider;


    @Prop()
    public isInitiated : boolean;

    @Prop()
    public contract : Contract;


    @MetaMaskStore.State('activeAccount')
    public activeAccount : string;

    @RuntimeStorage.State('feeTokens')
    public feeTokens : FeeToken[];


    public isReady : boolean = false;

    public isOwner : boolean = false;

    public balances : Balance[] = [];


    public async mounted ()
    {
        await this.$store.dispatch('RuntimeStorage/init');
        await this.loadAccount();
    }

    @Watch('activeAccount')
    public async loadAccount ()
    {
        this.isReady = false;

        const owner = await this.contract.owner();
        this.isOwner = this.activeAccount.toLowerCase() == owner.toLowerCase();

        for (const token of this.feeTokens) {
            const balanceInUnits = await this.dappProvider.signer.getBalance(token.address);
            token.balance = ethers.utils.formatUnits(balanceInUnits, token.decimals);
        }

        this.isReady = true;
    }

}
</script>

<style lang="scss">
.account-icon svg {
    width:         32px;
    height:        32px;

    border:        solid 1px rgba(255, 255, 255, 0.5);
    border-radius: 4px;
}
</style>
