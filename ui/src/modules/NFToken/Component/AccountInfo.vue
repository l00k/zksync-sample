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
                    class="mt-2 is-flex is-align-items-start account-tags"
                >
                    <b-tag
                        v-if="isOwner"
                        type="is-success"
                        class="mr-2"
                    >OWNER
                    </b-tag>

                    <b-taglist
                        v-for="part of balances"
                        attached
                        class="mr-2"
                    >
                        <b-tag type="is-dark">{{ part.token.symbol }}</b-tag>
                        <b-tag type="is-info">{{ part.balance }}</b-tag>
                    </b-taglist>
                </div>
            </div>

        </div>
    </div>
</template>

<script lang="ts">
import Jdenticon from '#/App/Component/Common/Jdenticon.vue';
import { FeeToken } from '#/App/Domain/Model/FeeToken';
import { DappProvider } from '#/App/Service/DappProvider';
import { BaseComponent } from '@inti5/app-frontend/Component';
import { Component } from '@inti5/app-frontend/Vue/Annotations';
import { Inject } from '@inti5/object-manager';
import { ethers } from 'ethers';
import * as Vue from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { Contract, Web3Provider } from 'zksync-web3';


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


    @Vue.InjectReactive('contract')
    public contract : Contract;

    @Vue.Prop()
    public isInitiated : boolean;


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

    @Vue.Watch('activeAccount')
    public async loadAccount ()
    {
        this.isReady = false;

        const owner = await this.contract.owner();
        this.isOwner = this.activeAccount.toLowerCase() == owner.toLowerCase();


        const promises = [];
        let i = 0;

        this.balances = [];
        for (const token of this.feeTokens) {
            const promise = new Promise<void>(resolve => {
                setTimeout(async() => {
                    const balanceInUnits = await this.dappProvider.signer.getBalance(token.address);
                    const balance = Number(ethers.utils.formatUnits(balanceInUnits, token.decimals));

                    this.balances.push({
                        token,
                        balance: balance.toFixed(3),
                    });

                    resolve();
                }, 100 * ++i);
            });
            promises.push(promise);
        }

        await Promise.all(promises);

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
.account-tags {
    .tags {
        margin-bottom: 0;
    }
}
</style>
