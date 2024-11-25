import toast from "react-hot-toast";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import { customToastStyle } from "../configs/constants";

function Edit({ show, handleClose, nftInfo, setNftInfo }: { show: boolean, handleClose: () => void, nftInfo: any, setNftInfo: Function }) {
    const [name, setName] = useState(nftInfo.name);
    const [description, setDescription] = useState(nftInfo.description)

    const handleLogin = () => {

    }

    return (
        <Modal show={show} centered onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit NFT info</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group controlId="formFile" className="mt-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" value={nftInfo.name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setNftInfo(
                                (prev: any) => { return { ...prev, ...{ name: e.target.value } } }
                            )
                        }}
                    />
                </Form.Group>
                <Form.Group controlId="formFile" className="mt-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" rows={10} value={nftInfo.description}
                        onChange={(e) => {
                            setDescription(e.target.value);
                            setNftInfo(
                                (prev: any) => { return { ...prev, ...{ description: e.target.value } } }
                            )
                        }}
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleLogin}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default Edit;