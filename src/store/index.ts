import { createStore } from "state-pool";

export const store = createStore({
    account: "",
    balance: "0",
    rBalance: "0",
    lBalance: "0",
    usdcBalance: "0",
    erc20LopTotalSupply: "0",
    erc20LopPrice: "0",
    erc20RLopTotalSupply: "0",
    treasuryAmount: "0",
    lopDaoPoolLimit: "0",
    erc20LHolders: [],
    swapStatus: false
})