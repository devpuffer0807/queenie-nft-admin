
import { Image, } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import Layout from "../layout";
import { BgColor } from "../App";
import BgImg from "../assets/img/bg.png";

function Dashboard(props: any) {
  const nav = useNavigate();
  return (
    <Layout>
      <div
        className="page-container dashboard"
        style={{ background: BgColor.BLUE }}
      >
        <Image id="bg-img" src={BgImg} alt="background" />

        <div className="card-content justify-content-between px-lg-4 d-flex flex-column" style={{ minHeight: "70vh" }}>

        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
