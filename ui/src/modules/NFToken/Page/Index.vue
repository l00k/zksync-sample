<template>
    <div class="g-page">
        <b-loading
            :is-full-page="true"
            :active="!isOk"
            :can-cancel="false"
        >
            <div class="loading-icon"></div>
            <div class="ml-6 pl-4">
                <div>{{ loadingMessage }}</div>
            </div>
        </b-loading>

        <div
            v-if="isReady"
            class="g-container g-container--default"
        >
            <div class="columns is-align-items-stretch">
                <div class="column is-6">
                    <DappInfo
                        :contract="contract"
                    />
                </div>
                <div class="column is-6">
                    <AccountInfo
                        :contract="contract"
                    />
                </div>
            </div>

            <div class="mt-2">
                <b-tabs
                    v-model="activeTab"
                    type="is-toggle"
                >
                    <b-tab-item
                        label="Create token"
                        icon="ghost"
                        :disabled="!isOwner"
                    >
                        <CreateTokenWizard
                            v-if="isOwner"
                            :contract="contract"
                        />
                    </b-tab-item>
                    <b-tab-item
                        label="Tokens for sale"
                        icon="money-bill-wave"
                    >
                        <TokensForSale
                            :contract="contract"
                        />
                    </b-tab-item>
                    <b-tab-item
                        label="User tokens"
                        icon="user"
                    >

                    </b-tab-item>
                </b-tabs>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { DappProvider } from '#/App/Service/DappProvider';
import AccountInfo from '#/NFToken/Component/AccountInfo.vue';
import DappInfo from '#/NFToken/Component/DappInfo.vue';
import CreateTokenWizard from '#/NFToken/Component/Tabs/CreateTokenWizard.vue';
import TokensForSale from '#/NFToken/Component/Tabs/TokensForSale.vue';
import { BaseComponent } from '@inti5/app-frontend/Component';
import { Component, Route } from '@inti5/app-frontend/Vue/Annotations';
import { Config } from '@inti5/configuration';
import { Inject } from '@inti5/object-manager';
import * as Vue from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { Contract } from 'zksync-web3';


const MetaMaskStore = namespace('MetaMask');


@Route('/', 'index')
@Component({
    components: {
        DappInfo,
        AccountInfo,
        CreateTokenWizard,
        TokensForSale,
    }
})
export default class IndexPage
    extends BaseComponent
{

    @Inject()
    public readonly dappProvider : DappProvider;


    @Config('module.dapp.targetChain')
    public readonly targetChain : number;


    @MetaMaskStore.State('activeAccount')
    public activeAccount : string;

    @MetaMaskStore.State('activeChain')
    public activeChain : number;


    public isReady : boolean = false;

    public isOk : boolean = false;
    public loadingMessage : string = 'Connecting to MetaMask';

    @Vue.ProvideReactive('contract')
    public contract : Contract;

    public isOwner : boolean = false;

    public activeTab : number = 1;


    public async mounted ()
    {
        this.isReady = false;

        try {
            await this.$store.dispatch('MetaMask/connect');

            await this.dappProvider.initProvider();

            this.contract = await this.dappProvider.initDapp(
                'NFToken',
                '0x236557F5A2Bea13A163136B0f92d6b2Ed5D2E805',
                require('#/NFToken/assets/abi.json')
            );

            this.isReady = true;
        }
        catch (e : any) {
            console.error(e);

            this.$buefy.snackbar.open({
                message: e.message,
                type: 'is-error',
                position: 'is-top',
            });
        }

        this.onChainChange(this.activeChain, true);
        this.onAccountChange(this.activeAccount, true);
    }

    @Vue.Watch('activeChain')
    protected onChainChange (
        chainId : number,
        initial : boolean = false
    )
    {
        if (!initial) {
            this.$buefy.snackbar.open({
                message: 'Chain changed',
                type: 'is-info',
                position: 'is-bottom-right',
            });
        }

        if (chainId != this.targetChain) {
            this.isOk = false;
            this.loadingMessage = 'Switch network to zkSync testnet';
        }
        else {
            this.isOk = true;
        }
    }

    @Vue.Watch('activeAccount')
    protected async onAccountChange (
        activeAccount : string,
        initial : boolean = false
    )
    {
        if (!initial) {
            this.$buefy.snackbar.open({
                message: 'Account changed',
                type: 'is-info',
                position: 'is-bottom-right',
            });
        }

        if (this.isReady) {
            const owner = await this.contract.owner();
            this.isOwner = activeAccount.toLowerCase() == owner.toLowerCase();
        }

        if (!this.isOwner) {
            if ([ 0 ].includes(this.activeTab)) {
                this.activeTab = 1;
            }
        }
    }

}
</script>

<style lang="scss">
.b-tabs .tab-content {
    padding:    0;
    margin-top: 1.5rem;
}
</style>
