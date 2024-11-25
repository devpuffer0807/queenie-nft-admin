import toast from "react-hot-toast";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import { customToastStyle, customToastSuccessStyle } from "../configs/constants";
import { setMetadata } from "../apis";

function Edit({ show, handleClose, nftInfo, setNftInfo, nftId }: { show: boolean, handleClose: () => void, nftInfo: any, setNftInfo: Function, nftId: string }) {
    const [name, setName] = useState(nftInfo.name);
    const [description, setDescription] = useState(nftInfo.description)

    const handleSave = async () => {
        if (!name) {
            return toast("Please input name", customToastStyle);
        }
        if (!description) {
            return toast("Please input description", customToastStyle);
        }

        const res = await setMetadata(nftId, name, description, nftInfo?.image)

        if (res) {
            handleClose();
            return toast("Save metadata successfully", customToastSuccessStyle);
        } else {
            return toast("Error to save metadata", customToastStyle);
        }
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
                <Button onClick={handleSave}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default Edit;