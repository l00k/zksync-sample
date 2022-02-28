<template>
    <div class="card">
        <div class="card-image">
            <Jdenticon
                :value="token.features"
                :size="128"
            />
        </div>
        <div class="card-content">
            <div class="media">
                <div class="media-content">
                    <p class="title is-4">{{ token.name }}</p>
                    <p class="subtitle is-6">Fancy token</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Jdenticon from '#/App/Component/Common/Jdenticon.vue';
import { NftToken } from '#/NFToken/Domain/Model/NftToken';
import BaseComponent from '@inti5/app-frontend/Component/BaseComponent.vue';
import { Component } from '@inti5/app-frontend/Vue/Annotations';
import { Prop } from 'vue-property-decorator';


@Component({
    components: {
        Jdenticon
    }
})
export default class TokenPreview
    extends BaseComponent
{

    @Prop()
    public token : NftToken;

}
</script>

<style scoped lang="scss">
.card {
    display: inline-block;
}
</style>
