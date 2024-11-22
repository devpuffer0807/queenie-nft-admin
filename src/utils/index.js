import Web3 from "web3";
import toast from "react-hot-toast";

import {
  customToastStyle,
  METAMASK_EXTENSION_LINK,
  CHAIN_ID,
  RPC_URL,
  CHAIN_NAME,
  CHAIN_NATIVE_CURRENCY,
  CHAIN_BLOCK_EXPLORER_URLS
} from "../configs/constants";

export const connectWallet = async () => {
  if (window.ethereum === undefined || !window.ethereum.isMetaMask) {
    toast("Please install metamask...", customToastStyle);
    setTimeout(() => {
      window.open(METAMASK_EXTENSION_LINK, "_blank");
    }, 4000);
    return;
  }

  let web3Provider;
  if (window.ethereum) {
    web3Provider = window.ethereum;
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      return toast("User denied account access", customToastStyle);
    }
  } else if (window.web3) {
    web3Provider = window.web3.currentProvider;
  } else {
    web3Provider = new Web3.providers.HttpProvider(RPC_URL);
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: CHAIN_ID }],
    });
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{ chainId: CHAIN_ID, rpcUrls: [RPC_URL], chainName: CHAIN_NAME, nativeCurrency: CHAIN_NATIVE_CURRENCY, blockExplorerUrls: [CHAIN_BLOCK_EXPLORER_URLS] }],
        });
      } catch (addError) {
        return toast("Add network error", customToastStyle);
        // handle "add" error
      }

      if (window.ethereum) {
        web3Provider = window.ethereum;
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
        } catch (error) {
          return toast("User denied account access", customToastStyle);
        }
      } else if (window.web3) {
        web3Provider = window.web3.currentProvider;
      } else {
        web3Provider = new Web3.providers.HttpProvider(RPC_URL);
      }
    } else {
      return toast("Switch network error", customToastStyle);
    }
    // handle other "switch" errors
  }
  return new Web3(web3Provider);
};

export function getShortAddress(address) {
  return address.substr(0, 6) + "..." + address.substr(-6);
}


export const getHttpWeb3 = () => {
  return new Web3(new Web3.providers.HttpProvider(RPC_URL));
}

export function getLocaleString(data) {
  return (parseFloat(data) || 0).toLocaleString();
}