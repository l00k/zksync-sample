import { NftToken } from '#/NFToken/Domain/Model/NftToken';

export class NftTokenWrap
{
    
    public tokenId : number = 0;
    
    public token : NftToken;
    
    public price? : string;
    
    public buying? : boolean;
    
}
