<template>
    <div class="panel is-primary">
        <header class="panel-heading">
            <div class="panel-heading-title is-justify-content-space-between">
                <span>
                    dApp info
                </span>
            </div>
        </header>
        <div class="panel-block">

            <div>
                <div class="has-font-size-sm has-font-weight-bold">
                    Contract address
                </div>
                <div>
                    {{ contract.address }}
                </div>

                <div class="has-font-size-sm has-font-weight-bold">
                    Chain ID
                </div>
                <div>
                    {{ activeChain }}
                </div>
            </div>

        </div>
    </div>
</template>

<script lang="ts">
import BaseComponent from '@inti5/app-frontend/Component/BaseComponent.vue';
import { Component } from '@inti5/app-frontend/Vue/Annotations';
import { Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { Contract } from 'zksync-web3';


const MetaMaskStore = namespace('MetaMask');


@Component()
export default class DappInfo
    extends BaseComponent
{

    @Prop()
    public contract : Contract;

    @MetaMaskStore.State('activeChain')
    public activeChain : number;


}
</script>
