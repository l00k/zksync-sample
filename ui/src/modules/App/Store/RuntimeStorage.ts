import { EntityRuntimeCache } from '@inti5/api-frontend/EntityRuntimeCache';
import { asyncGeneratorToArray } from '@inti5/utils/asyncGeneratorToArray';
import { App } from '@inti5/app-frontend/App';
import { ObjectManager } from '@inti5/object-manager';
import { Action, Module, VuexModule } from 'vuex-module-decorators';


@Module({
    dynamic: true,
    store: ObjectManager.getSingleton().getInstance(App).getVuexStore(),
    preserveState: false,
    namespaced: true,
    name: 'StakePools/RuntimeStorage',
})
export class RuntimeStorage
    extends VuexModule<RuntimeStorage>
{
    
    public initPromise : Promise<boolean> = null;
    
    
    @Action
    public async init () : Promise<boolean>
    {
        if (!this.context.state.initPromise) {
        }
        
        
        return this.context.state.initPromise;
    }
    
}
