import axios from "axios";

const BACKEND_SERVER = "https://6hycovk5eqs4w6azmd55ffjwvm0mtvle.lambda-url.us-east-1.on.aws/metadata/"

export async function getMetaData(nftId) {
    const data = await axios.get(`${BACKEND_SERVER}${nftId}.json`).then().catch(() => { });

    return data.data;
}

export async function setMetadata(nftId, name, description, image) {
    const res = await axios.post(BACKEND_SERVER, { nftId, name, description, image });

    return res?.data?.success;
}