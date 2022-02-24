import { Deployer } from '@matterlabs/hardhat-zksync-deploy';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { Wallet } from 'zksync-web3';


// Testnet account wallet
const deployerAccount = new Wallet('0xcaf557e8ada2d984cc672d56e0dae227cc6ec648e0ecf03e170117be8f07f4fb');


export default async function(hre : HardhatRuntimeEnvironment) {
    console.log('Deploying contract...');
    
    const deployer = new Deployer(hre, deployerAccount);
    const artifact = await deployer.loadArtifact('SampleToken');
    
    const nfTokenContract = await deployer.deploy(artifact, [
        'TestToken',
        'TT',
        'https://example.com/t/',
        1000
    ]);
    
    console.log('### Deployed to');
    console.log(nfTokenContract.address);
}
