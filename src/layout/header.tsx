import toast, { Toaster } from "react-hot-toast";
import { Image } from "react-bootstrap";
import { BiX } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

import LogoImg from "../assets/img/logo.png";
import SignIn from "../components/SignIn";
import { useState } from "react";

function Header(props: any) {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);


  return (
    <div className="w-100">
      <Toaster position="top-right" />
      <SignIn show={showLogin} handleClose={() => { setShowLogin(false) }} />
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
