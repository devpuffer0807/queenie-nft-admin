
import { Image, } from "react-bootstrap";
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';

import Layout from "../layout";
import { BgColor } from "../App";
import BgImg from "../assets/img/bg.png";

function Dashboard(props: any) {

  const searchHandler = async () => {

  }

  return (
    <Layout>
      <div
        className="page-container dashboard"
        style={{ background: BgColor.BLUE }}
      >
        <Image id="bg-img" src={BgImg} alt="background" />

        <div className="card-content justify-content-between px-lg-4 d-flex flex-column" style={{ minHeight: "70vh" }}>
          <Card>
            <Card.Body>
              <Form.Group controlId="formFile" className="mt-3">
                <Form.Label>Index of NFT</Form.Label>
                <Stack direction="horizontal">
                  <Form.Control type="text" onChange={() => { }} placeholder="Please input the index of NFT" style={{ maxWidth: 300 }} />
                  <Button style={{ marginLeft: 10 }} onClick={searchHandler}>Search</Button>
                </Stack>
              </Form.Group>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
