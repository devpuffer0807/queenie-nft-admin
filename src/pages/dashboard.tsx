
import { useState } from "react";
import { Image, } from "react-bootstrap";
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import Container from 'react-bootstrap/Container';
import { AiFillEdit } from "react-icons/ai";
// @ts-ignore
import * as S3FileUpload from "react-s3";
import toast from "react-hot-toast";

import Layout from "../layout";
import { BgColor } from "../App";
import BgImg from "../assets/img/bg.png";
import Loading from "../components/Loading";
import Edit from "../components/Edit";
import { customToastStyle, customToastSuccessStyle } from "../configs/constants";

import { getMetaData, setMetadata } from "../apis";

function Dashboard(props: any) {

  const [nftId, setNftId] = useState("");
  const [nftInfo, setNftInfo]: [nftInfo: any, setNftInfo: Function] = useState({});
  const [showEdit, setShowEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingFile, setLoadingFile] = useState(false);

  const searchHandler = async () => {
    if (loading) return;
    setLoading(true);
    const metadata = await getMetaData(nftId)
    setNftInfo(metadata);
    setLoading(false);
  }

  const fileChangeHadler = (event: any) => {
    if (!(event?.target?.files?.length > 0)) {
      return "";
    }
    const file = event.target.files[0];
    setLoading(true);
    setLoadingFile(true);

    S3FileUpload.uploadFile(file, {
      bucketName: process.env.REACT_APP_S3_BUCKET_NAME,
      accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
      region: "us-east-1",
    })
      .then(async (data: any) => {
        const res = await setMetadata(nftId, nftInfo?.name, nftInfo?.description, data.location)
        if (res) {
          toast("Save metadata successfully", customToastSuccessStyle);
        } else {
          toast("Error to save metadata", customToastStyle);
        }
        setNftInfo({ ...nftInfo, ...{ image: data.location } })
        setLoadingFile(false);
        setLoading(false);


      })
      .catch((err: any) => {
        setLoadingFile(false);
        setLoading(false);
      });
  }

  return (
    <Layout>
      {
        loading && <Loading />
      }
      <Edit show={showEdit} handleClose={() => setShowEdit(false)} nftInfo={nftInfo} setNftInfo={setNftInfo} nftId={nftId} />
      <div
        className="page-container dashboard"
        style={{ background: BgColor.BLUE }}
      >
        <Image id="bg-img" src={BgImg} alt="background" />

        <div className="card-content px-lg-4 d-flex flex-column" style={{ minHeight: "70vh", alignItems: "center", padding: 40 }}>
          <h1>Admin panel of Queenie NFT collection</h1>

          <Card style={{ width: "100%", marginTop: 30 }}>
            <Card.Body>
              <Form.Group controlId="formFile" className="mt-3">
                <Form.Label>Index of NFT</Form.Label>
                <Stack direction="horizontal">
                  <Form.Control type="text" value={nftId} onChange={(e) => { setNftId(e.target.value) }} placeholder="Please input the index of NFT" style={{ maxWidth: 300 }} />
                  <Button style={{ marginLeft: 10 }} onClick={searchHandler}>Search</Button>
                </Stack>
              </Form.Group>
            </Card.Body>
          </Card>

          {
            nftInfo.image &&
            (<Container className="mt-5" style={{ minHeight: 400 }}>
              <Stack direction="horizontal" style={{ justifyContent: "center", alignItems: "flex-start" }}>
                <div style={{ maxWidth: "40%", marginRight: 20, width: 500 }}>
                  <div style={{ justifyContent: "space-between", fontWeight: "bold", width: "100%", fontSize: 26, display: "flex", alignItems: "center", paddingRight: 20 }}>
                    {nftInfo?.name}
                    <Button variant="default" onClick={() => { setShowEdit(true) }}>
                      <AiFillEdit />
                    </Button>
                  </div>

                  <div style={{ marginTop: 20 }}>
                    <div style={{ width: "100%", display: "flex", justifyContent: "space-between", paddingRight: 20, fontWeight: "bold", fontSize: 18 }}>
                      Description:
                    </div>
                    <div>{nftInfo?.description}</div>
                  </div>
                </div>
                <div>
                  <Image src={nftInfo.image} style={{ width: 350, borderRadius: 10 }} />
                  <Form.Control type="file" onChange={fileChangeHadler} style={{ display: loadingFile ? "none" : "block", width: 350, marginTop: 5 }} />
                </div>
              </Stack>
            </Container>)
          }
        </div>
      </div>
    </Layout >
  );
}

export default Dashboard;
