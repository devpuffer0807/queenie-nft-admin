import { useEffect, useMemo, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import toast from "react-hot-toast";
import Web3 from "web3";

import Loading from "./Loading";

import {
  READ_DAO_CONTRACT,
  WRITE_DAO_CONTRACT,
} from "../configs/smart_contracts";
import { store } from "../store";
import { customToastStyle } from "../configs/constants";

function ReleaseBid({
  show,
  activeAddress,
  handleClose,
  selectedProposalId,
}: {
  show: boolean;
  activeAddress: string;
  handleClose: () => void;
  selectedProposalId: string;
}) {
  const [info, setInfo]: [info: any, setInfo: Function] = useState({});
  const [toReleaseAmount, setToReleaseAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [account] = store.useState("account");

  const init = async () => {
    if (!selectedProposalId) {
      return;
    }
    const owner = await READ_DAO_CONTRACT.methods.owner().call();
    const vestingInfo: any = await READ_DAO_CONTRACT.methods
      .vestingList(parseInt(selectedProposalId))
      .call();

    const amount = Web3.utils.fromWei(vestingInfo?.amount, "ether");
    const claimedAmount = Web3.utils.fromWei(vestingInfo?.claimed, "ether");
    const claimed = amount === claimedAmount;
    const to = vestingInfo?.to;
    const token = vestingInfo?.token ? "rLOP" : "LOP";
    const commissionId = vestingInfo?.commissionId;

    let isVester = account
      ? ((await READ_DAO_CONTRACT.methods
          .isCommissionMembers(commissionId, account)
          .call()) as boolean)
      : false;
    if (account === owner) {
      isVester = true;
    }

    const _info: any = {
      amount,
      claimedAmount,
      claimed,
      to,
      token,
      commissionId,
      isVester,
    };
    setInfo(_info);
  };

  const remainingAmount = useMemo(() => {
    return parseFloat(info?.amount) - parseFloat(info?.claimedAmount);
  }, [info]);

  useEffect(() => {
    init();
  }, [selectedProposalId]);

  const releaseTask = async () => {
    if (!account) {
      return toast("Please connect wallet to create bid.", customToastStyle);
    }
    if (info?.claimed) {
      return toast("You already claimed this", customToastStyle);
    }
    if (!toReleaseAmount) {
      return toast("Please input release amount.", customToastStyle);
    }
    if (!selectedProposalId) {
      return toast("Proposal id error.", customToastStyle);
    }

    try {
      setLoading(true);
      const writeDaoContract = await WRITE_DAO_CONTRACT();
      await writeDaoContract.methods
        .releaseVest(
          parseInt(selectedProposalId),
          Web3.utils.toWei(toReleaseAmount, "ether")
        )
        .send({
          from: account,
          gasLimit: parseInt(process.env.REACT_APP_GAS_LIMIT || "0"),
        });
      handleClose();
      await init();
      setToReleaseAmount("");
      return toast("Release the task successfully.", customToastStyle);
    } catch (e) {
      return toast("Error to release task.", customToastStyle);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeToReleaseAmount = (e: any) => {
    if (parseFloat(e?.target?.value) > remainingAmount) {
      return toast("Please input a valid number.", customToastStyle);
    }
    setToReleaseAmount(e.target.value);
  };

  return (
    <>
      {loading && <Loading />}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Release</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant={"success"}>
            <div>Proposal Creator</div>
            <div>{activeAddress}</div>
            <div>Receive Address</div>
            <div>{info?.to}</div>
          </Alert>
          {!info?.isVester && (
            <Alert variant={"danger"}>
              Only commission member can release this task.
            </Alert>
          )}
          <Card>
            <Card.Body>
              <Card.Text>
                Total Amount: {info?.amount} {info?.token}
              </Card.Text>
              <Card.Text>
                Amount Released: {info?.claimedAmount} {info?.token}
              </Card.Text>
              <Card.Text>
                Amount Remaining: {remainingAmount} {info?.token}
              </Card.Text>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Release Amount({info?.token})</Form.Label>
                <Form.Control
                  type="text"
                  value={toReleaseAmount}
                  onChange={handleChangeToReleaseAmount}
                  disabled={!info?.isVester || info?.claimed}
                />
              </Form.Group>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={releaseTask}
            disabled={!info?.isVester || info?.claimed}
          >
            Release
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ReleaseBid;
