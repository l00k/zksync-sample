<template>
    <ui-block
        title="Create token wizard"
    >
        <div class="columns">
            <div class="column is-6">
                <h1 class="title is-4">Create new</h1>

                <TxHandler
                    :contract="contract"
                    endpoint="mintForSale"
                    :args="[ priceInEth, token ]"
                >
                    <validate-provider
                        name="Name"
                        :rules="{ required: true, min: 4 }"
                        v-slot="{ errors }"
                    >
                        <b-field
                            label="Name"
                            label-position="on-border"
                            :type="errors.length > 0 ? 'is-danger' : ''"
                            :message="errors"
                        >
                            <b-input v-model="token.name"></b-input>
                        </b-field>
                    </validate-provider>

                    <validate-provider
                        name="Features"
                        :rules="{
                            required: true,
                            min: 10,
                            max: 10,
                            digits: 10,
                        }"
                        v-slot="{ errors }"
                    >
                        <b-field
                            label="Features"
                            label-position="on-border"
                            :type="errors.length > 0 ? 'is-danger' : ''"
                            :message="errors"
                        >
                            <b-input
                                v-model="token.features"
                                maxlength="10"
                            ></b-input>
                        </b-field>
                    </validate-provider>

                    <validate-provider
                        name="Price"
                        :rules="{
                            required: true,
                            min_value: 0.0001,
                            max_value: 1000,
                        }"
                        v-slot="{ errors }"
                    >
                        <b-field
                            label="Price"
                            label-position="on-border"
                            :type="errors.length > 0 ? 'is-danger' : ''"
                            :message="errors"
                        >
                            <b-numberinput
                                v-model="price"
                                :min="0.0001"
                                :max="1000"
                                :step="0.0001"
                                maxlength="10"
                            ></b-numberinput>
                        </b-field>
                    </validate-provider>

                </TxHandler>
            </div>

            <div class="column is-6">
                <h1 class="title is-4">Preview</h1>

                <TokenPreview
                    :token="token"
                />
            </div>
        </div>
    </ui-block>
</template>

<script lang="ts">
import Jdenticon from '#/App/Component/Common/Jdenticon.vue';
import TxHandler from '#/App/Component/Common/TxHandler.vue';
import TokenPreview from '#/NFToken/Component/TokenPreview.vue';
import { NftToken } from '#/NFToken/Domain/Model/NftToken';
import BaseComponent from '@inti5/app-frontend/Component/BaseComponent.vue';
import { Component } from '@inti5/app-frontend/Vue/Annotations';
import { BigNumber, ethers } from 'ethers';
import { Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { Contract } from 'zksync-web3';


const MetaMaskStore = namespace('MetaMask');
const RuntimeStorage = namespace('RuntimeStorage');


@Component({
    components: {
        TxHandler,
        TokenPreview,
        Jdenticon
    }
})
export default class CreateTokenWizard
    extends BaseComponent
{

    @Prop()
    public contract : Contract;


    public token : NftToken = new NftToken();
    public price : number = 0.01;

    public get priceInEth () : BigNumber
    {
        return ethers.utils.parseEther(this.price.toString());
    }


    public async mounted ()
    {
        this.setRandomToken();
    }

    public setRandomToken ()
    {
        this.token = new NftToken();
        this.token.name = 'Sample';
        this.token.features = 1e9 + Math.round(Math.random() * (9e9 - 1));
    }

}
</script>

<style scoped lang="scss">
.field {
    margin-bottom: 1.5rem;
}
</style>
