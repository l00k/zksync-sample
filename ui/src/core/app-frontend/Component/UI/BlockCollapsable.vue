<template>
    <b-collapse
        class="panel"
        :class="{ [type]: true }"
        animation="slide"
        :open="open"
        :aria-id="componentId"
    >
        <div
            slot="trigger"
            slot-scope="props"
            class="panel-heading"
            :aria-controls="componentId"
        >
            <header
                class="panel-heading-title is-justify-content-space-between"
                @click.stop
            >
                <slot name="header">
                    <span>{{ title }}</span>
                </slot>

                <a
                    v-if="toggable"
                    class="card-header-icon"
                >
                    <b-icon pack="fas" :icon="props.open ? 'caret-down' : 'caret-up'"/>
                </a>
            </header>
        </div>

        <div class="panel-block">
            <slot></slot>
        </div>
    </b-collapse>
</template>

<script lang="ts">
import { UiBlock } from '@inti5/app-frontend/Component';
import { Component } from '@inti5/app-frontend/Vue/Annotations';
import { Prop } from 'vue-property-decorator';
import BaseComponent from '../BaseComponent.vue';

@Component()
export default class UiBlockCollapsable
    extends UiBlock
{

    @Prop({ default: true })
    public open : boolean;

    @Prop({ default: false })
    public toggable : boolean;

}
</script>

<style scoped lang="scss">
.card {
    overflow: visible;
}
</style>
