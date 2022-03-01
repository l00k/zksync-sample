<template>
    <div
        class="panel"
        :class="{ [type]: true }"
    >
        <div class="panel-heading">
            <div class="panel-heading-title is-justify-content-space-between">
                <slot name="header">
                    <span>{{ title }}</span>
                </slot>
            </div>
        </div>
        <div class="panel-block">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { Component } from '@inti5/app-frontend/Vue/Annotations';
import { Prop } from 'vue-property-decorator';
import BaseComponent from '../BaseComponent.vue';

@Component()
export default class UiBlock
    extends BaseComponent
{

    @Prop()
    public title : string;

    @Prop({ default: 'is-primary' })
    public type : string;

}
</script>

<style scoped lang="scss">
.card {
    overflow: visible;
}
</style>
