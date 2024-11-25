import axios from "axios";

const BACKEND_SERVER = "http://localhost:4000/metadata/"

export async function getMetaData(nftId) {
    const data = await axios.get(`${BACKEND_SERVER}${nftId}.json`).then().catch(() => { });
    
    return data.data;
}