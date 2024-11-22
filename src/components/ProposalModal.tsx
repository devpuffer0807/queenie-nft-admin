import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Countdown from "react-countdown";
import Web3 from "web3";

import { READ_DAO_CONTRACT } from "../configs/smart_contracts";
import FileIcon from "../assets/img/file.png";

const COMMISSION_PROPOSAL = "Commission Budget";

function ProposalMoadl({
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
    if (COMMISSION_PROPOSAL === proposalInfo?.proposalType) {
      (async () => {
        const commission: any = await READ_DAO_CONTRACT.methods
          .commissions(parseInt(proposalInfo?.commissionId))
          .call();
        setCommissionInfo({
          name: commission?.name,
          approvedBudget: Web3.utils.fromWei(
            commission?.approvedBudget || "0",
            "ether"
          ),
          usedBudget: Web3.utils.fromWei(
            commission?.usedBudget || "0",
            "ether"
          ),
        });
      })();
    }
  }, [proposalInfo]);
  return (
    <>
      <Modal show={show} onHide={handleClose} scrollable>
        <Modal.Header closeButton>
          <Modal.Title>{proposalInfo?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <Card.Body>
              <div className="mt-2">Creator</div>
              <div className="font-14"> {proposalInfo?.creator}</div>
              <div className="mt-2">Proposal Type</div>
              <div className="font-14"> {proposalInfo?.proposalType}</div>
              <div className="mt-2">Proposal Status</div>
              <div className="font-14"> {proposalInfo?.status}</div>
              <div className="mt-2">Title</div>
              <div className="font-14"> {proposalInfo?.title}</div>
              <div className="mt-2">Description</div>
              <div className="font-14"> {proposalInfo?.description}</div>
              <div className="mt-2">Amount</div>
              <div className="font-14"> {proposalInfo?.proposalAmount}</div>
              <div className="mt-2">Created At</div>
              <div className="font-14"> {proposalInfo?.createdAt}</div>
              {proposalInfo?.file && (
                <>
                  <div className="mt-2">File</div>
                  <div className="font-14">
                    <img src={FileIcon} alt="file" style={{ width: 30 }} />
                    <a
                      href={proposalInfo.file_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {proposalInfo.file}
                    </a>
                  </div>
                </>
              )}
              <div className="mt-2">Remain</div>
              <Countdown
                date={Date.now() + proposalInfo?.remain * 1000}
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
              <div className="mt-2">Vote(Yes/No)</div>
              <div className="font-14">
                {" "}
                {proposalInfo?.voteYesAmount} / {proposalInfo?.voteNoAmount}
              </div>
              <div className="mt-2">Vote Percent(Yes/No)</div>
              <div className="font-14">
                {" "}
                {proposalInfo?.voteYesPercent}% / {proposalInfo?.voteNoPercent}%
              </div>
            </Card.Body>
          </Card>
          {COMMISSION_PROPOSAL === proposalInfo?.proposalType && (
            <Card style={{ marginTop: 20 }}>
              <Card.Body>
                <Card.Title>Commission Info</Card.Title>
                <Card.Text>
                  Approved Budget: {comissionInfo?.approvedBudget}(LOP/rLOP),
                  Used Budget: {comissionInfo?.usedBudget}(LOP/rLOP)
                </Card.Text>
              </Card.Body>
            </Card>
          )}
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

export default ProposalMoadl;
