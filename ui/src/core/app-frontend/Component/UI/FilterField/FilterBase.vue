<script lang="ts">
import { Component } from '@/core/app-frontend/Vue/Annotations';
import numbro from 'numbro';
import { Prop, Watch } from 'vue-property-decorator';
import BaseComponent from '../../BaseComponent.vue';


export type FilterConfig = {
    numberFormat? : string,
    serialize? : (value : any) => any,
    unserialize? : (value : any) => any,
};


@Component()
export default class UiFilterBase
    extends BaseComponent
{

    @Prop({ default: () => ({}) })
    public config : FilterConfig;

    @Prop({ default: false })
    public numeric : boolean;

    @Prop()
    public filter : { [operator : string] : any };

    public rawValue : any = {};

    protected operators : string[];


    public mounted()
    {
        this.onFilterChange();
    }

    @Watch('filter', { deep: true })
    public onFilterChange()
    {
        if (!this.filter) {
            return;
        }

        this.operators
            .forEach(operator => {
                if (this.numeric) {
                    this.rawValue[operator] = typeof this.filter[operator] != 'number'
                        ? ''
                        : this.config.numberFormat
                            ? numbro(this.filter[operator]).format(this.config.numberFormat)
                            : this.filter[operator];
                }
                else {
                    this.rawValue[operator] = this.filter[operator];
                }

                if (this.config.unserialize) {
                    if (this.rawValue[operator]) {
                        this.rawValue[operator] = this.config.unserialize(this.rawValue[operator]);
                    }
                }
            });

        (<any>this.rawValue).__ob__.dep.notify();
    }

    public clear()
    {
        this.operators
            .forEach(operator => this.$delete(this.filter, operator));
    }

    public onRawValueChange()
    {
        if (!this.rawValue) {
            return;
        }

        this.operators
            .forEach(operator => {
                if (this.numeric) {
                    this.filter[operator] = this.rawValue[operator] === ''
                        ? undefined
                        : this.config.numberFormat
                            ? numbro.unformat(this.rawValue[operator], this.config.numberFormat)
                            : +this.rawValue[operator];
                }
                else {
                    this.filter[operator] = this.rawValue[operator];
                }

                if (this.config.serialize) {
                    if (this.filter[operator]) {
                        this.filter[operator] = this.config.serialize(this.filter[operator]);
                    }
                }
            });

        this.filter.__ob__.dep.notify();
    }

}
</script>
