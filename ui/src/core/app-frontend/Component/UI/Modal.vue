<template>
    <b-modal
        :active.sync="visible"
        v-bind="$attrs"
        v-on="$listeners"
    >
        <slot>aaaa</slot>
    </b-modal>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import BaseComponent from '../BaseComponent.vue';


@Component
export default class UiModal
    extends BaseComponent
{

    public visible : boolean = false;

    public show()
    {
        this.visible = true;
    }

    public hide()
    {
        this.visible = false;
    }

}
</script>
