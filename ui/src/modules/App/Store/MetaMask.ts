import { RuntimeException } from '@/core/inti5/utils/Exception';
import { App } from '@inti5/app-frontend/App';
import { ObjectManager } from '@inti5/object-manager';
import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';


export class MetaMaskException
    extends RuntimeException {};


@Module({
    dynamic: true,
    store: ObjectManager.getSingleton().getInstance(App).getVuexStore(),
    preserveState: false,
    namespaced: true,
    name: 'MetaMask',
})
export class MetaMask
    extends VuexModule<MetaMask>
{

    public connectionPromise : Promise<void>;
    
    public activeAccount : string;
    public activeChain : number;
    
    
    @Action
    public async connect () : Promise<void>
    {
        if (this.connectionPromise) {
            return this.connectionPromise;
        }
    
        window.ethereum.on('accountsChanged', (accounts) => this.context.commit('changeAccount', accounts));
        window.ethereum.on('chainChanged', (chainId) => this.context.commit('changeChain', chainId));
    
        this.connectionPromise = new Promise(async(resolve, reject) => {
            if (!window.ethereum) {
                throw new MetaMaskException('Ethereum wallet not defined', 1645776849420);
            }
        
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                if (!accounts.length) {
                    throw new MetaMaskException('No account defined', 1645777022599);
                }
            
                this.context.commit('changeAccount', accounts);
                this.context.commit('changeChain', window.ethereum.networkVersion);
                
                resolve();
            }
            catch (e : any) {
                reject(e);
            }
        });
    
        return this.connectionPromise;
    }
    
    @Mutation
    public changeAccount (accounts : string[])
    {
        this.activeAccount = accounts[0];
    }
    
    @Mutation
    public changeChain (chainId : number)
    {
        this.activeChain = Number(chainId);
    }
    
}
