import { useEffect, useState, useMemo } from "react";
import { Table } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import toast from "react-hot-toast";
import Web3 from "web3";
import BigNumber from "bignumber.js";
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
// @ts-ignore
import * as S3FileUpload from "react-s3";

import { creteTask } from "../apis/vestApi";
import { customToastStyle } from "../configs/constants";
import Loading from "./Loading";

import {
  getBids,
} from "../apis/vestApi";
import { store } from "../store";
import {
  WRITE_DAO_CONTRACT,
  READ_DAO_CONTRACT,
  READ_ERC20LOP_CONTRACT,
  READ_ERC20_R_LOP_CONTRACT,
  READ_USDC_CONTRACT,
} from "../configs/smart_contracts";
import { DAO_ADDRESS } from "../configs/addresses";
import { USDC_DECIMALS } from "../configs/constants";

function WorkProposalWithMember({
  show,
  handleClose,
  selectedAccount,
}: {
  show: boolean;
  handleClose: () => void;
  selectedAccount: string;
}) {
  const nav = useNavigate();

  const proposalId = "";
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [loadingFile, setLoadingFile] = useState(false);
  const [taskName, settaskName] = useState("");
  const [taskDescription, settaskDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCommission, setSelectedCommission] = useState("");
  const [commissions, setCommissions]: [
    commissions: any,
    setCommissions: Function
  ] = useState([]);
  const [tokenType, setTokenType] = useState("");
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lopDaoPoolLimit, setlopDaoPoolLimit] = useState("");
  const [lopDaoPoolused, setlopDaoPoolused] = useState("");
  const [rlopSupplyLimit, setrlopSupplyLimit] = useState("");
  const [rlopTotalSupply, setrlopTotalSupply] = useState("");

  const [erc20LopPrice, setErc20LopPrice] = store.useState("erc20LopPrice");
  const [treasuryAmount, setTreasuryAmount] = store.useState("treasuryAmount");
  const [account] = store.useState("account");

  useEffect(() => {
    (async () => {
      const _lopDaoPoolLimit = await READ_DAO_CONTRACT.methods
        .lopDaoPoolLimit()
        .call();
      setlopDaoPoolLimit(
        Web3.utils.fromWei(_lopDaoPoolLimit?.toString() || "", "ether")
      );
      const _lopDaoPoolused = await READ_DAO_CONTRACT.methods
        .lopDaoPoolused()
        .call();
      setlopDaoPoolused(
        Web3.utils.fromWei(_lopDaoPoolused?.toString() || "", "ether")
      );
      const _rlopSupplyLimit = await READ_DAO_CONTRACT.methods
        .rlopSupplyLimit()
        .call();
      setrlopSupplyLimit(
        Web3.utils.fromWei(_rlopSupplyLimit?.toString() || "", "ether")
      );
      const _rlopTotalSupply = await READ_ERC20_R_LOP_CONTRACT.methods
        .totalSupply()
        .call();
      setrlopTotalSupply(
        Web3.utils.fromWei(_rlopTotalSupply?.toString() || "", "ether")
      );
      const _erc20LopPrice = await READ_ERC20LOP_CONTRACT.methods
        .tokenPrice()
        .call();
      const _erc20LopPriceDecimal = await READ_ERC20LOP_CONTRACT.methods
        .tokenPriceDecimal()
        .call();
      setErc20LopPrice(
        BigNumber(_erc20LopPrice?.toString() || "0")
          .div(BigNumber(_erc20LopPriceDecimal?.toString() || "1"))
          .toString()
      );
      const _treasuryAmount = await READ_USDC_CONTRACT.methods
        .balanceOf(DAO_ADDRESS)
        .call();
      setTreasuryAmount(_treasuryAmount?.toString() || "0");
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const commissionIndex = await READ_DAO_CONTRACT.methods
        .commissionIndex()
        .call();
      const owner = await READ_DAO_CONTRACT.methods.owner().call();
      const _commissions: any = [];
      for (let i = 0; i < parseInt(commissionIndex?.toString() || "0"); i++) {
        const commission: any = await READ_DAO_CONTRACT.methods
          .commissions(i)
          .call();
        let isCommissionMember = account
          ? await READ_DAO_CONTRACT.methods
              .isCommissionMembers(i, account)
              .call()
          : false;
        if (owner === account) {
          isCommissionMember = true;
        }
        console.log(commission?.approvedBudget);
        _commissions.push({
          name: commission?.name,
          approvedBudget: Web3.utils.fromWei(
            commission?.approvedBudget || "0",
            "ether"
          ),
          usedBudget: Web3.utils.fromWei(
            commission?.usedBudget || "0",
            "ether"
          ),
          approvedBudgetLOP: Web3.utils.fromWei(
            commission?.approvedBudgetLOP || "0",
            "ether"
          ),
          usedBudgetLOP: Web3.utils.fromWei(
            commission?.usedBudgetLOP || "0",
            "ether"
          ),
          id: i,
          isCommissionMember,
        });
      }
      setCommissions(_commissions);
    })();
  }, [account]);

  useEffect(() => {
    (async () => {
      if (proposalId) {
        // Fetch bids for the proposal
        const res = await getBids({ proposalId });
        setBids(res);
      }
    })();
  }, [proposalId]);

  const vestEnabled = useMemo(() => {
    return commissions[parseInt(selectedCommission)]?.isCommissionMember;
  }, [selectedCommission, commissions]);

  const amountToUsd = useMemo(() => {
    return parseFloat(amount) * parseFloat(erc20LopPrice as string) || 0;
  }, [amount, erc20LopPrice]);

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
  };

  const amountInputHandler = (e: any) => {
    // check commission amount
    const _amount = parseFloat(e?.target?.value);
    if (!tokenType) {
      return toast("Please select token type", customToastStyle);
    }
    if (tokenType === "false") {
      // LOP
      const unusedComissionAmount =
        parseFloat(
          commissions[parseInt(selectedCommission)]?.approvedBudgetLOP
        ) -
        parseFloat(commissions[parseInt(selectedCommission)]?.usedBudgetLOP);
      if (_amount > unusedComissionAmount) {
        return toast(
          "Commission amount should be less than remaining commission amount of LOP",
          customToastStyle
        );
      }
      const unusedDaoPoolLimit =
        parseFloat(lopDaoPoolLimit) - parseFloat(lopDaoPoolused);
      if (unusedDaoPoolLimit < _amount) {
        return toast(
          "Commission amount should be less than remaining DAO pool limit",
          customToastStyle
        );
      }
    }
    if (tokenType === "true") {
      // rLOP
      const unusedComissionAmount =
        parseFloat(commissions[parseInt(selectedCommission)]?.approvedBudget) -
        parseFloat(commissions[parseInt(selectedCommission)]?.usedBudget);
      if (_amount > unusedComissionAmount) {
        return toast(
          "Commission amount should be less than remaining commission amount of rLOP",
          customToastStyle
        );
      }
      const unusedrLop =
        parseFloat(rlopSupplyLimit) - parseFloat(rlopTotalSupply);
      if (unusedrLop < _amount) {
        return toast(
          "Commission amount should be less than remaining rLOP supply",
          customToastStyle
        );
      }
      const rLopCap =
        parseFloat(rlopTotalSupply) * parseFloat(erc20LopPrice as string);
      const vestCap = _amount * parseFloat(erc20LopPrice as string);
      const treasury = parseFloat(treasuryAmount as string) / USDC_DECIMALS;
      if (rLopCap + vestCap > treasury) {
        return toast(
          "There is not enough USDC balance to mint rLOP in Dao",
          customToastStyle
        );
      }
    }

    setAmount(e?.target?.value);
  };

  const createVestHandler = async () => {
    if (loading) {
      return toast("Please wait...", customToastStyle);
    }
    if (!account) {
      return toast(
        "Please connect wallet to create payment.",
        customToastStyle
      );
    }
    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return toast("Please input amount", customToastStyle);
    }
    if (!tokenType) {
      return toast("Please select token type", customToastStyle);
    }
    if (!taskName) {
      return toast("Please input task name", customToastStyle);
    }
    if (!taskDescription) {
      return toast("Please input task description", customToastStyle);
    }

    const owner = await READ_DAO_CONTRACT.methods.owner().call();
    let isCommissionMember = account
      ? await READ_DAO_CONTRACT.methods
          .isCommissionMembers(selectedCommission, account)
          .call()
      : false;
    if (owner === account) {
      isCommissionMember = true;
    }
    if (!isCommissionMember) {
      return toast("Only commission member can assign task.", customToastStyle);
    }

    try {
      setLoading(true);

      const _amount = Web3.utils.toWei(amount, "ether");

      const writeDaoContract = await WRITE_DAO_CONTRACT();
      const _tokenType = tokenType === "false" ? false : true;
      const chainProposalId: number = await READ_DAO_CONTRACT.methods
        .vestingIndex()
        .call();
      await writeDaoContract.methods
        .createVest(_amount, selectedCommission, selectedAccount, _tokenType)
        .send({
          from: account,
          gasLimit: parseInt(process.env.REACT_APP_GAS_LIMIT || "0"),
        });

      const res = await creteTask({
        commissionId: selectedCommission,
        commissionName: commissions[parseInt(selectedCommission)]?.name,
        tokenType: tokenType,
        amount: amount,
        taskName: taskName,
        taskDescription: taskDescription,
        fileUrl: fileUrl,
        fileName: fileName,
        fileType: fileType,
        creator: selectedAccount,
        proposalId: chainProposalId.toString(),
      });

      handleClose();

      if (res) {
        toast("Create task successfully.", customToastStyle);
        nav("/dao/vests");
      } else {
        toast("Error to created a task.", customToastStyle);
      }
    } catch (e) {
      return toast(
        "There is an error to interact smart contract",
        customToastStyle
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loading />}
      <Modal show={show} onHide={handleClose} fullscreen scrollable>
        <Modal.Header closeButton>
          <Modal.Title>Assign a new task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Commission</Form.Label>
            <Form.Select
              value={selectedCommission}
              onChange={(e) => {
                setSelectedCommission(e.target.value);
              }}
            >
              <option>Please select option</option>
              {commissions.map((item: any, index: number) => (
                <option key={index} value={item?.id}>
                  Name: {item?.name}, Approved Budget LOP:{" "}
                  {item?.approvedBudgetLOP}(LOP), Used Budget LOP:{" "}
                  {item?.usedBudgetLOP}(LOP) Approved Budget rLOP:{" "}
                  {item?.approvedBudget}(rLOP), Used Budget rLOP:{" "}
                  {item?.usedBudget}(rLOP)
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Token Type</Form.Label>
            <Form.Select
              value={tokenType}
              onChange={(e) => {
                setTokenType(e.target.value);
              }}
              disabled={!vestEnabled}
            >
              <option>Please select token type</option>
              <option value={"false"}>LOP</option>
              <option value={"true"}>rLOP</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="amount">
            <Form.Label>
              Amount{" "}
              {tokenType === "false"
                ? "(LOP)"
                : tokenType === "true"
                ? "(rLOP)"
                : ""}{" "}
              (${amountToUsd})
            </Form.Label>
            <Form.Control
              type="text"
              value={amount}
              onChange={amountInputHandler}
              disabled={!vestEnabled}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="amount">
            <Form.Label>To</Form.Label>
            <Form.Control type="text" value={selectedAccount} disabled={true} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="to">
            <Form.Label>Task Name</Form.Label>
            <Form.Control
              type="text"
              value={taskName}
              onChange={(e) => settaskName(e.target.value)}
              disabled={!vestEnabled}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="to">
            <Form.Label>Task Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={taskDescription}
              onChange={(e) => settaskDescription(e.target.value)}
              disabled={!vestEnabled}
            />
          </Form.Group>

          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Upload File</Form.Label>
            {loadingFile && (
              <Form.Group>
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </Form.Group>
            )}
            <Form.Control
              type="file"
              onChange={fileChangeHadler}
              style={{ display: loadingFile ? "none" : "block" }}
              disabled={!vestEnabled}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="create vest">
            <Button
              variant="primary"
              onClick={createVestHandler}
              style={{ opacity: !vestEnabled || loading ? 0.2 : 1 }}
              disabled={!vestEnabled}
            >
              Assign Task
            </Button>
          </Form.Group>
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

export default WorkProposalWithMember;
