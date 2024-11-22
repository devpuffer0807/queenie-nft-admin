import axios from "axios";

const instance = axios.create({
  // baseURL: "http://localhost:4000",
  baseURL:
    "https://blksxwjgeqntedxpa2cz447bwq0jgfnr.lambda-url.us-east-1.on.aws",
});

export const creteTask = async ({
  commissionId,
  commissionName,
  tokenType,
  amount,
  taskName,
  taskDescription,
  fileUrl,
  fileName,
  fileType,
  creator = "",
  proposalId = "",
}) => {
  const res = await instance
    .post("creteTask", {
      commissionId,
      commissionName,
      tokenType,
      amount,
      taskName,
      taskDescription,
      fileUrl,
      fileName,
      fileType,
      creator,
      proposalId,
    })
    .catch(() => {
      return false;
    });

  return res?.data?.success;
};

export const getTime = async () => {
  const res = await instance.get("/").catch(() => {
    return +new Date();
  });

  return +res?.data;
};

export const getTasks = async () => {
  const res = await instance.post("getTasks").catch(() => {
    return [];
  });
  const resData = res?.data;
  let result = [];
  for (var i = 0; i < resData.length; i++) {
    result.push(resData[i]);
    result[i].index = i;
  }
  return result;
};

export const createBid = async ({
  proposalId,
  bid,
  creator,
  fileName,
  fileType,
  fileUrl,
}) => {
  const res = await instance
    .post("createBid", {
      proposalId,
      bid,
      creator,
      fileName,
      fileType,
      fileUrl,
    })
    .catch(() => {
      return false;
    });
  return res?.data?.success;
};

export const getBids = async ({ proposalId }) => {
  const res = await instance.post("getBids", { proposalId }).catch(() => {
    return [];
  });
  return res?.data;
};

export const assignTaskForProposal = async ({ id, proposalId, creator }) => {
  const res = await instance
    .post("assignTaskForProposal", {
      id,
      proposalId,
      creator,
    })
    .catch(() => {
      return false;
    });
  return res?.data?.success;
};

export const assignTaskForBid = async ({ id, assigned }) => {
  const res = await instance
    .post("assignTaskForBid", {
      id,
      assigned,
    })
    .catch(() => {
      return false;
    });
  return res?.data?.success;
};

export const getOrg = async () => {
  const res = await instance.post("getOrg").catch(() => {
    return {};
  });
  const resData = res?.data;
  try {
    const data = JSON.parse(resData[0]?.data);
    return data;
  } catch (e) {
    return {};
  }
};

export const setOrg = async (data) => {
  const res = await instance.post("setOrg", { data }).catch(() => {
    return false;
  });
  return res?.data?.success;
};

export const deleteProposal = async ({ id }) => {
  const res = await instance
    .post("deleteProposal", {
      id,
    })
    .catch(() => {
      return false;
    });
  return res?.data?.result;
};

export const setCommissionApi = async ({
  commissionId,
  name,
  contact,
  member,
}) => {
  const res = await instance
    .post("setCommission", {
      commissionId: commissionId + "",
      name,
      contact,
      member,
    })
    .catch(() => {
      return false;
    });
  return res?.data?.result;
};

export const getCommissionApi = async ({ commissionId }) => {
  const res = await instance
    .post("getCommission", { commissionId })
    .catch(() => {
      return [];
    });
  return res?.data;
};
