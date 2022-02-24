<template>
    <b-field
        label="Range"
        label-position="on-border"
    >
        <b-input
            v-model.lazy="rawValue.$gte"
            placeholder="Min"
            @change.native="onRawValueChange"
        />
        <b-input
            v-model.lazy="rawValue.$lte"
            placeholder="Max"
            @change.native="onRawValueChange"
        />
    </b-field>
</template>

<script lang="ts">
import UiFilterBase from './FilterBase.vue';
import { Component } from '../../../Vue/Annotations';


@Component()
export default class UiFilterRange
    extends UiFilterBase
{

    public rawValue = {
        $gte: '',
        $lte: '',
    };

    protected operators : string[] = [ '$gte', '$lte' ];

}
</script>
