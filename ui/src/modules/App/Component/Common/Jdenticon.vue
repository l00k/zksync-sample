<template>
    <div
        class="svg-holder"
        v-html="svgContent"
    ></div>
</template>

<script lang="ts">
import BaseComponent from '@inti5/app-frontend/Component/BaseComponent.vue';
import { Component } from '@inti5/app-frontend/Vue/Annotations';
import { Prop, Vue, Watch } from 'vue-property-decorator';
import { toSvg } from 'jdenticon';

@Component()
export default class Jdenticon
    extends Vue
{

    @Prop()
    public value : string;

    @Prop({ default: 32 })
    public size : number;

    public svgContent : string = '';

    public mounted()
    {
        this.onAddressChange(this.value);
    }

    @Watch('value')
    public onAddressChange(address : string)
    {
        this.svgContent = toSvg(this.value, this.size);
    }

}
</script>
