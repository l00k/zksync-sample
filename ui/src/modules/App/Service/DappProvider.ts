import { Singleton } from '@inti5/object-manager';
import { Contract, Provider, Signer, Web3Provider } from 'zksync-web3';


@Singleton()
export class DappProvider
{
    
    public signer : Signer;
    
    public provider : Provider;
    
    public contracts : { [name : string] : Contract } = {};
    
    
    public async initProvider (chainRpcUrl : string)
    {
        this.provider = new Provider(chainRpcUrl);
        this.signer = (new Web3Provider(window.ethereum)).getSigner();
    }
    
    public async initDapp (
        key : string,
        contractAddress : string,
        contractAbi : any
    ) : Promise<Contract>
    {
        if (!this.contracts[key]) {
            this.contracts[key] = new Contract(
                contractAddress,
                contractAbi,
                this.signer
            );
        }
        
        return this.contracts[key];
    }
    
}
