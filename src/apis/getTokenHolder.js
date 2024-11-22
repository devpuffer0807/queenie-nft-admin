import { AnkrProvider } from '@ankr.com/ankr.js';

import { ANKR_NETWORK, ANKR_KEY } from '../configs/constants';

export const getTokenHolders = async (tokenAddress) => {

    // Setup provider AnkrProvider
    const provider = new AnkrProvider(`https://rpc.ankr.com/multichain/${ANKR_KEY}`);

    try {
        const tokenHolders = await provider.getTokenHolders({
            blockchain: ANKR_NETWORK,
            contractAddress: tokenAddress,
        })
    
        const result = [];
        const res = tokenHolders?.holders || [];
        for (var i = 0; i < res.length; i++) {
            result.push({
                index: i + 1,
                holderAddress: res[i].holderAddress,
                balance: res[i].balance
            })
        }
    
        return result;
    } catch(e) {
        return [];
    }
}
