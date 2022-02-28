import { Singleton } from '@inti5/object-manager';
import { Contract, Signer, Web3Provider } from 'zksync-web3';


@Singleton()
export class DappProvider
{
    
    public signer : Signer;
    
    public provider : Web3Provider;
    
    public contracts : { [name : string] : Contract } = {};
    
    
    public async initProvider ()
    {
        this.provider = new Web3Provider(window.ethereum);
        this.signer = this.provider.getSigner();
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
