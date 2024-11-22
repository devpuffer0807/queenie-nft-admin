import toast from "react-hot-toast";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import { customToastStyle } from "../configs/constants";

function SignIn({ show, handleClose, }: { show: boolean, handleClose: () => void, }) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = () => {
        if (email === "info@lowdenstreet.com" && password === "123456") {
            return handleClose();
        }

        toast("Login error", customToastStyle);
    }

    return (
        <Modal show={show} onHide={handleClose} centered >
            <Modal.Header closeButton>
                <Modal.Title>Sign In</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group controlId="formFile" className="mt-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="text" value={email} onChange={(e) => { setEmail(e.target.value) }} />
                </Form.Group>
                <Form.Group controlId="formFile" className="mt-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleLogin}>
                    Login
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default SignIn;