import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import toast from "react-hot-toast";
// @ts-ignore
import * as S3FileUpload from "react-s3";

import { store } from "../store";
import { customToastStyle, customToastSuccessStyle } from "../configs/constants";
import { createBid as createBidApi } from '../apis/vestApi';

function MakeBid({ show, handleClose, selectedProposalId }: { show: boolean, handleClose: () => void, selectedProposalId: string }) {
    const [bidDescription, setBidDescription] = useState('');
    const [loadingFile, setLoadingFile] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState("");
    const [fileType, setFileType] = useState("");
    const [fileUrl, setFileUrl] = useState("");

    const [account] = store.useState("account");

    const createBid = async () => {
        if(loading) {
            return toast("Pending task.", customToastStyle);
        }
        setLoading(true);
        if (!account) {
            return toast("Please connect wallet to create bid.", customToastStyle);
        }
        if (!bidDescription) {
            return toast("Please input bid.", customToastStyle);
        }
        if (!selectedProposalId) {
            return toast("Proposal id error.", customToastStyle);
        }
        const res = await createBidApi({ proposalId: selectedProposalId, bid: bidDescription, creator: account, fileName, fileType, fileUrl })
        setLoading(false);
        if (res) {
            setBidDescription("")
            handleClose();
            return toast("Created bid successfully.", customToastSuccessStyle);
        } else {
            return toast("Error to create a new bid.", customToastStyle);
        }
    }

    const fileChangeHadler = (event: any) => {
        if (!(event?.target?.files?.length > 0)) {
            return "";
        }
        const file = event.target.files[0];

        setLoadingFile(true);

        S3FileUpload.uploadFile(file, {
            bucketName: process.env.REACT_APP_S3_BUCKET_NAME,
            accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
            secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
            region: "us-east-1",
        })
            .then((data: any) => {
                setFileUrl(data.location);
                setFileName(file.name);
                setFileType(file.type);
                setLoadingFile(false);
            })
            .catch((err: any) => {
                setLoadingFile(false);
            });
    }

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Bid</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Card>
                        <Card.Body>
                            <Form.Control as="textarea" rows={5} value={bidDescription} onChange={(e: any) => setBidDescription(e.target.value)} placeholder='Please input bid' />
                            <Form.Group controlId="formFile" className="mt-3">
                                <Form.Label>Upload File</Form.Label>
                                {
                                    loadingFile &&
                                    <Form.Group>
                                        <Spinner animation="border" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </Spinner>
                                    </Form.Group>
                                }
                                <Form.Control type="file" onChange={fileChangeHadler} style={{ display: loadingFile ? "none" : "block" }}/>
                            </Form.Group>   
                        </Card.Body>
                    </Card>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={createBid}>
                        Bid
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default MakeBid;