import '@matterlabs/hardhat-zksync-deploy';
import '@matterlabs/hardhat-zksync-solc';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-truffle5';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-web3';
import '@typechain/hardhat';
import dotenv from 'dotenv';
import 'hardhat-gas-reporter';
import 'hardhat-watcher';
import { HardhatUserConfig } from 'hardhat/config';
import 'solidity-coverage';

dotenv.config();
const alchemyApiKey = process.env.ALCHEMY_API_KEY;

const config : HardhatUserConfig = {
    solidity: {
        version: '0.8.4',
        settings: {
            optimizer: {
                enabled: true,
                runs: 1000,
            },
            outputSelection: {
                '*': {
                    '*': [ 'storageLayout' ]
                }
            }
        },
    },
    networks: {
        hardhat: {
            // forking: {
            //     url: `https://eth-mainnet.alchemyapi.io/v2/${alchemyApiKey}`,
            //     blockNumber: 13980000
            // }
        }
    },
    zksolc: {
        version: '0.1.0',
        compilerSource: 'docker',
        settings: {
            optimizer: {
                enabled: true,
            },
            experimental: {
                dockerImage: 'matterlabs/zksolc',
            },
        },
    },
    zkSyncDeploy: {
        zkSyncNetwork: 'https://zksync2-testnet.zksync.dev',
        ethNetwork: 'goerli',
    },
};

export default config;
