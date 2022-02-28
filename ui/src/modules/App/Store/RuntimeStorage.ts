import { FeeToken } from '#/App/Domain/Model/FeeToken';
import { App } from '@inti5/app-frontend/App';
import { ObjectManager } from '@inti5/object-manager';
import ethers from 'ethers';
import { Action, Module, VuexModule } from 'vuex-module-decorators';
import { Contract, Provider } from 'zksync-web3';



@Module({
    dynamic: true,
    store: ObjectManager.getSingleton().getInstance(App).getVuexStore(),
    preserveState: false,
    namespaced: true,
    name: 'RuntimeStorage',
})
export class RuntimeStorage
    extends VuexModule<RuntimeStorage>
{

    protected initPromise : Promise<void>;
    
    public feeTokens : FeeToken[] = [];
    
    
    @Action
    public async init ()
    {
        if (this.context.state.initPromise) {
            return this.context.state.initPromise;
        }
        
        this.context.state.initPromise = new Promise((resolve, reject) => {
            this.context.state.feeTokens = require('#/App/assets/tokens.json');
            resolve();
        });
    }
    
}
