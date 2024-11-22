import toast, { Toaster } from "react-hot-toast";
import BigNumber from "bignumber.js";
import { Image } from "react-bootstrap";
import { BiX } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

import { connectWallet, getShortAddress } from "../utils";
import { customToastStyle, customToastSuccessStyle } from "../configs/constants";
import { store } from "../store";

import LogoImg from "../assets/img/logo.png";

function Header(props: any) {
  const navigate = useNavigate();

  const [account, setAccount] = store.useState("account");

  const connectWalletHandler = async () => {
    const web3 = await connectWallet();
    if (web3 && typeof web3 !== "string") {
      const accounts = await web3.eth.getAccounts();

      setAccount(accounts[0]);
      const _balance = await web3.eth.getBalance(accounts[0]);
      if (new BigNumber(_balance.toString()).isEqualTo(BigNumber("0"))) {
        return toast("Your balance is 0", customToastStyle);
      }

      // setBalance(_balance);

      return toast("Connected success", customToastSuccessStyle);
    }
  }

  const disconnectWalletHandler = async () => {
    setAccount("");
    return toast("Disconnected success", customToastSuccessStyle);
  }

  const connectButtonHandler = async () => {
    if (account === "") {
      connectWalletHandler();
    } else {
      disconnectWalletHandler();
    }
  }
  return (
    <div className="w-100">
      <Toaster position="top-right" />
      {props.open && (
        <div className="active-menu">
          <div className="mb-2 d-lg-none" style={{ textAlign: "right" }}>
            <BiX size={50} onClick={() => props.setOpen(false)} />
          </div>
        </div>
      )}
      <div className="header">
        <div className="logo">
          <Image src={LogoImg} width={150} alt="logo" style={{ cursor: "pointer" }} onClick={() => {
            navigate("/");
          }} />
        </div>
      </div>
    </div>
  );
}

export default Header;
