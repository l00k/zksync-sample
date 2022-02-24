import { ObjectManager } from '@inti5/object-manager';
import Vue, { ComponentOptions } from 'vue';
import { componentFactory } from 'vue-class-component/lib/component';


export function Component (config : ComponentOptions<Vue> = {})
{
    return (Target : any) => {
        if (!config.mixins) {
            config.mixins = [];
        }
        
        // add dependency load
        config.mixins.push({
            created ()
            {
                ObjectManager.getSingleton()
                    .loadDependencies(this, Target.prototype);
            }
        });
        
        return <any>componentFactory(Target, config);
    };
}
