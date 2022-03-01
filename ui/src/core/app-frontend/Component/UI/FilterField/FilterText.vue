<template>
    <b-field
        label="Phrase"
        label-position="on-border"
    >
        <b-input
            v-model.lazy="rawValue.$like"
            placeholder="Type phrase to search.."
            @change.native="onRawValueChange"
        />
    </b-field>
</template>

<script lang="ts">
import { FilterConfig } from '@inti5/app-frontend/Component/UI/FilterField/FilterBase.vue';
import UiFilterBase from './FilterBase.vue';
import { Component } from '../../../Vue/Annotations';
import { Prop } from 'vue-property-decorator';
import trim from 'lodash/trim';


@Component()
export default class UiFilterText
    extends UiFilterBase
{

    @Prop({
        default: () => ({
            serialize: (value : string) => '%' + trim(value, '%') + '%',
            unserialize: (value : string) => trim(value, '%')
        })
    })
    public declare config : FilterConfig;

    public rawValue = {
        $like: '',
    };

    protected operators : string[] = [ '$like' ];

}
</script>
