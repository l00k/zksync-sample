<template>
    <div class="ui-table">
        <div
            v-if="pagination"
            class="columns is-justify-content-space-between"
        >
            <div class="column">
                <b-field
                    label="Items per page"
                    label-position="on-border"
                >
                    <b-select v-model="pagination.itemsPerPage">
                        <option
                            v-for="option in pagination.itemsPerPageOptions"
                            :key="option"
                            :value="option"
                        >{{ option }}
                        </option>
                    </b-select>
                </b-field>
            </div>
            <div class="column">
                <b-pagination
                    :per-page="pagination.itemsPerPage"
                    :total="calcPagination.total"
                    :current.sync="pagination.page"
                    order="is-right"
                    class="is-flex-grow-0"
                />
            </div>
        </div>

        <b-table
            ref="table"

            :data="data"

            :backend-sorting="backend"
            :sort-multiple="true"
            :sort-multiple-data="rawSorting"
            sort-icon=" fas fa-caret-up"

            :paginated="!backend"
            :backend-pagination="backend"
            :per-page="pagination.itemsPerPage"
            :current-page="pagination.page"
            pagination-position="bottom"

            @sort="onSort"

            v-bind="$attrs"
            v-on="$listeners"
        >
            <slot v-for="(_, name) in $slots" :slot="name" :name="name" />

            <template v-for="(_, name) in $scopedSlots" :slot="name" slot-scope="slotData">
                <slot v-bind="slotData" :name="name" />
            </template>

            <template #default="slotData">
                <slot v-bind="slotData" name="default" />

                <ui-table-column
                    v-if="showActions"
                    label="Actions"
                    :searchable="true"
                    :filter-type="FilterType.None"
                    :style="{ width: '50px' }"
                >
                    <template #searchable>
                        <div class="b-table__cell--actions">
                            <b-button
                                size="is-small"
                                type="is-warning is-light"
                                @click="clearFilters()"
                            >Clear
                            </b-button>
                        </div>
                    </template>
                    <template>
                        <slot v-bind="slotData" name="actions" />
                    </template>
                </ui-table-column>
            </template>

            <template #empty>
                <slot name="empty">
                    <div class="content has-text-grey has-text-centered">
                        <p class="mt-6 mb-6">
                            <b-icon
                                pack="fas"
                                icon="heart-broken"
                                size="is-small"
                                class="is-valign-middle"
                            />
                            Nothing here.
                        </p>
                    </div>
                </slot>
            </template>
        </b-table>

        <div class="columns is-justify-content-space-between mt-4">
            <div class="column">
                <b-field
                    label="Items per page"
                    label-position="on-border"
                >
                    <b-select v-model="pagination.itemsPerPage">
                        <option
                            v-for="option in pagination.itemsPerPageOptions"
                            :key="option"
                            :value="option"
                        >{{ option }}
                        </option>
                    </b-select>
                </b-field>
            </div>
            <div class="column">
                <b-pagination
                    :per-page="pagination.itemsPerPage"
                    :total="calcPagination.total"
                    :current.sync="pagination.page"
                    order="is-right"
                    class="is-flex-grow-0"
                />
            </div>
        </div>

    </div>
</template>

<script lang="ts">
import { flatternObject } from '@/core/inti5/utils/flattenObject';
import { unflatternObject } from '@/core/inti5/utils/unflattenObject';
import * as Api from '@inti5/api-frontend';
import Vue from 'vue';
import isEmpty from 'lodash/isEmpty';
import { Prop, Ref } from 'vue-property-decorator';
import BaseComponent from '../../../Component/BaseComponent.vue';
import { FilterType } from '../../../Domain/Filter';
import { Component } from '../../../Vue/Annotations';


@Component()
export default class UiTable
    extends BaseComponent
{

    protected FilterType = FilterType;

    @Ref('table')
    protected $table : Vue;

    @Prop({ default: true })
    public showActions : boolean;

    @Prop({ default: false })
    public backend : boolean;

    @Prop({ default: () => [] })
    public data : any[];

    @Prop({ default: () => ({}) })
    public sorting : Api.Domain.Sorting<any>;

    @Prop({ default: () => new Api.Domain.Pagination() })
    public pagination : Api.Domain.Pagination;

    public rawSorting : { field : string, order : string }[] = [];


    public mounted()
    {
        if (!isEmpty(this.sorting)) {
            this.rawSorting = <any> Object.entries(flatternObject(this.sorting)).map(([field, order]) => ({ field, order: order.toString().toLowerCase() }));
        }
    }

    public get calcPagination () : Partial<Api.Domain.Pagination>
    {
        if (this.backend) {
            return this.pagination;
        }
        else {
            return {
                ...this.pagination,
                total: this.data.length,
            };
        }
    }

    public clearFilters ()
    {
        (<any>this.$table).resetMultiSorting();

        this.$table.$children
            .filter(($child : Vue) => $child.$options.name === 'BSlotComponent')
            .map(($child : Vue) => $child.$children[0])
            .forEach(($child : any) => {
                if (typeof $child.clear != 'undefined') {
                    $child.clear();
                }
            });
    }

    public onSort (field : string, order : string, event : PointerEvent)
    {
        if (!event.ctrlKey) {
            this.rawSorting = this.rawSorting.filter(e => e.field === field);
        }

        const idx = this.rawSorting.findIndex(e => e.field === field);
        if (idx !== -1) {
            this.rawSorting[idx].order = this.rawSorting[idx].order == 'asc'
                ? 'desc'
                : 'asc';
        }
        else {
            this.rawSorting.push({ field, order: 'asc' });
        }

        const newSorting = unflatternObject(
            Object.fromEntries(<any> this.rawSorting.map(e => [e.field, e.order.toUpperCase()]))
        );
        this.$emit('update:sorting', newSorting);
    }

}
</script>
