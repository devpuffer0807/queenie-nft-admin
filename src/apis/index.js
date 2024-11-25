import axios from "axios";

const BACKEND_SERVER = "http://localhost:4000/metadata/"

export async function getMetaData(nftId) {
    const data = await axios.get(`${BACKEND_SERVER}${nftId}.json`).then().catch(() => { });

    return data.data;
}

export async function setMetadata(nftId, name, description, image) {
    const res = await axios.post(BACKEND_SERVER, { nftId, name, description, image });

    return res?.data?.success;
}