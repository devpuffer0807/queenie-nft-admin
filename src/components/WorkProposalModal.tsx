import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Countdown from "react-countdown";
import Web3 from "web3";

import { READ_DAO_CONTRACT } from "../configs/smart_contracts";
import FileIcon from "../assets/img/file.png";

const COMMISSION_PROPOSAL = "Commission Budget";

function WorkProposalModal({
  show,
  handleClose,
  proposalInfo,
}: {
  show: boolean;
  handleClose: () => void;
  proposalInfo: any;
}) {
  const [comissionInfo, setCommissionInfo]: [
    comissionInfo: any,
    setCommissionInfo: Function
  ] = useState({});

  useEffect(() => {
    console.log("========", proposalInfo);
  }, [proposalInfo]);
  return (
    <>
      <Modal show={show} onHide={handleClose} scrollable>
        <Modal.Header closeButton>
          <Modal.Title>{proposalInfo?.taskName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <Card.Body>
              <div className="mt-2">Commission Name</div>
              <div className="font-14"> {proposalInfo?.commissionName}</div>
              <div className="mt-2">LOP Approved</div>
              <div className="font-14"> {proposalInfo?.approvedBudgetLOP}</div>
              <div className="mt-2">LOP Used</div>
              <div className="font-14"> {proposalInfo?.usedBudgetLOP}</div>
              <div className="mt-2">rLOP Approved</div>
              <div className="font-14"> {proposalInfo?.approvedBudget}</div>
              <div className="mt-2">rLOP Used</div>
              <div className="font-14"> {proposalInfo?.usedBudget}</div>
              <div className="mt-2">Task Name</div>
              <div className="font-14"> {proposalInfo?.taskName}</div>
              <div className="mt-2">Task Description</div>
              <div className="font-14"> {proposalInfo?.taskDescription}</div>
              <div className="mt-2">Created Date</div>
              <div className="font-14"> {proposalInfo?.createdAt}</div>
              <div className="mt-2">Remain</div>
              <div className="font-14">
                {" "}
                <Countdown
                  date={+Date.now() + proposalInfo?.remain}
                  renderer={({ days, hours, minutes, seconds, completed }) => {
                    if (completed) {
                      return <span>Expired</span>;
                    } else {
                      return (
                        <span>
                          {days}d {hours}h {minutes}m {seconds}s
                        </span>
                      );
                    }
                  }}
                />
              </div>
              {proposalInfo.fileUrl && <div className="mt-2">Attachment</div>}
              {proposalInfo.fileUrl && (
                <div className="font-14">
                  {" "}
                  <img src={FileIcon} alt="file" style={{ width: 30 }} />
                  <a
                    href={proposalInfo.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {proposalInfo.fileName}
                  </a>
                </div>
              )}

              <div className="mt-2">Amount</div>
              <div className="font-14">
                {" "}
                {`${proposalInfo?.amount} ${
                  proposalInfo?.tokenType === "false" ? "LOP" : "rLOP"
                }`}
              </div>

              <div className="mt-2">Status</div>
              <div className="font-14">
                {" "}
                {`${
                  proposalInfo?.claimed === undefined
                    ? "Open Bid"
                    : proposalInfo?.amount === proposalInfo?.claimed
                    ? "Released"
                    : "Releasing..."
                }`}
              </div>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default WorkProposalModal;
