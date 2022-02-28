import { ExternalProvider } from '@ethersproject/providers';

declare global
{
    interface Window {
        ethereum : ExternalProvider & {
            networkVersion : number,
            on : Function,
        }
    };
}

window.ethereum = window.ethereum || {};
