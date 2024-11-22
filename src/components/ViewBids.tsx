import { useEffect, useMemo, useState } from "react";
import { Table } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import toast from "react-hot-toast";
import Web3 from "web3";

import { customToastStyle } from "../configs/constants";
import Loading from "./Loading";
import FileIcon from "../assets/img/file.png";

import {
  getBids,
  assignTaskForBid,
  assignTaskForProposal,
} from "../apis/vestApi";
import { store } from "../store";
import {
  WRITE_DAO_CONTRACT,
  READ_DAO_CONTRACT,
} from "../configs/smart_contracts";

function ViewBids({
  show,
  handleClose,
  proposalId,
  amount,
  tokenType,
  selectedCommission,
  selectedAccount,
}: {
  show: boolean;
  handleClose: () => void;
  proposalId: string;
  amount: string;
  tokenType: string;
  selectedCommission: string;
  selectedAccount: string;
}) {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCommissionMember, setIsCommissionMember] = useState(false);

  const [account] = store.useState("account");

  useEffect(() => {
    (async () => {
      if (proposalId) {
        // Fetch bids for the proposal
        const res = await getBids({ proposalId });
        setBids(res);
      }
    })();
  }, [proposalId]);

  useEffect(() => {
    (async () => {
      try {
        let _isCommissionMember: boolean = false;
        if (selectedCommission) {
          _isCommissionMember = account
            ? await READ_DAO_CONTRACT.methods
                .isCommissionMembers(selectedCommission, account)
                .call()
            : false;
        }

        const owner = await READ_DAO_CONTRACT.methods.owner().call();
        if (owner === account) {
          _isCommissionMember = true;
        }
        setIsCommissionMember(_isCommissionMember);
      } catch (e) {}
    })();
  }, [account]);

  const isOrgAssigned = useMemo(() => {
    if (selectedAccount) {
      const res =
        bids.findIndex((b: any) => b.creator === selectedAccount) === -1
          ? true
          : false;
      console.log(res);
      return res;
    }
    return false;
  }, [selectedAccount, bids]);

  const assignTask = async (bidId: string, to: string) => {
    setLoading(true);

    if (loading) {
      return toast("Please wait...", customToastStyle);
    }
    if (!account) {
      return toast("Please connect wallet to assign task.", customToastStyle);
    }
    if (!isCommissionMember) {
      return toast("Only commission member can assign task.", customToastStyle);
    }

    const _amount = Web3.utils.toWei(amount, "ether");

    try {
      const writeDaoContract = await WRITE_DAO_CONTRACT();
      const _tokenType = tokenType === "false" ? false : true;
      const chainProposalId: number = await READ_DAO_CONTRACT.methods
        .vestingIndex()
        .call();
      await writeDaoContract.methods
        .createVest(_amount, selectedCommission, to, _tokenType)
        .send({
          from: account,
          gasLimit: parseInt(process.env.REACT_APP_GAS_LIMIT || "0"),
        });
      await assignTaskForProposal({
        id: proposalId,
        proposalId: chainProposalId.toString(),
        creator: to,
      });
      await assignTaskForBid({ id: bidId, assigned: "success" });
      handleClose();
      return toast("Task assigned successfully.", customToastStyle);
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {loading && <Loading />}
      <Modal show={show} onHide={handleClose} fullscreen scrollable>
        <Modal.Header closeButton>
          <Modal.Title>View Bids</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {bids.length === 0 && !isOrgAssigned ? (
            <div className="w-100 d-flex justify-content-center">
              No bids found.
            </div>
          ) : (
            <Table responsive>
              <thead>
                <tr className="font-14 inter-regular">
                  <th>No</th>
                  <th>Address of Bidder</th>
                  <th>Bid description</th>
                  <th>File</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="font-14 inter-bold">
                {isOrgAssigned && (
                  <tr key={"org_assigned"}>
                    <td>Assigned Directly</td>
                    <td>{selectedAccount}</td>
                    <td
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "40vw",
                      }}
                    >
                      No bid
                    </td>
                    <td>No file</td>
                  </tr>
                )}
                {bids.map((item: any, index: number) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item?.creator}</td>
                    <td
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "40vw",
                      }}
                    >
                      {item?.bid}
                    </td>
                    <td>
                      {item.fileUrl ? (
                        <>
                          <img
                            src={FileIcon}
                            alt="file"
                            style={{ width: 30 }}
                          />
                          <a
                            href={item.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {item.fileName}
                          </a>
                        </>
                      ) : (
                        "No file"
                      )}
                    </td>
                    <td>
                      {item.assigned !== "success" && isCommissionMember && (
                        <Button
                          variant="primary"
                          onClick={() => {
                            assignTask(item?.id, item?.creator);
                          }}
                          disabled={!!selectedAccount}
                        >
                          Assign Task
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
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

export default ViewBids;
