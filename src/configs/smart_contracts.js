import { getHttpWeb3, connectWallet } from "../utils";
import { ERC20LOP_ADDRESS, ERC20RLOP_ADDRESS, USDC_ADDRESS, DAO_ADDRESS } from "./addresses";

import ERC20LOPABI from "./abi/ERC20LOP.json";
import ERC20RLOPABI from "./abi/ERC20RLOP.json";
import USDCABI from "./abi/USDC.json";
import DaoABI from "./abi/Dao.json";

const httpWeb3 = getHttpWeb3();

export const READ_ERC20LOP_CONTRACT = new httpWeb3.eth.Contract(ERC20LOPABI, ERC20LOP_ADDRESS);
export const READ_ERC20_R_LOP_CONTRACT = new httpWeb3.eth.Contract(ERC20RLOPABI, ERC20RLOP_ADDRESS);
export const READ_USDC_CONTRACT = new httpWeb3.eth.Contract(USDCABI, USDC_ADDRESS);
export const READ_DAO_CONTRACT = new httpWeb3.eth.Contract(DaoABI, DAO_ADDRESS);

export const WRITE_ERC20LOP_CONTRACT = async () => {
    const web3 = await connectWallet();
    return new web3.eth.Contract(ERC20LOPABI, ERC20LOP_ADDRESS);
}
export const WRITE_ERC20_R_LOP_CONTRACT = async () => {
    const web3 = await connectWallet();
    return new web3.eth.Contract(ERC20RLOPABI, ERC20RLOP_ADDRESS);
}
export const WRITE_USDC_CONTRACT = async () => {
    const web3 = await connectWallet();
    return new web3.eth.Contract(USDCABI, USDC_ADDRESS);
}
export const WRITE_DAO_CONTRACT = async () => {
    const web3 = await connectWallet();
    return new web3.eth.Contract(DaoABI, DAO_ADDRESS);
}