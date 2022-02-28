import { BigNumber } from 'ethers';

export class NftToken
{
    
    public name : string = 'Noname';
    
    public features : string = '0000000000';
    
    
    public toApi () : any
    {
        return {
            name: this.name,
            features: BigNumber.from(Number(this.features)),
            createdAt: 0,
        };
    }
    
}
