import awsCloudFront from "aws-cloudfront-sign";
import awsSDK from "aws-sdk";
import axios from "axios";
import { Buffer } from "buffer";

// @ts-ignore
window.Buffer = Buffer;

export const uploadFile = (data) => {
    const d = new Date();
    let fname = `${d.getTime()}`;
    awsSDK.config.update({
        accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
    });
    const s3 = new awsSDK.S3();
    return new Promise(function (resolve, reject) {
        s3.putObject(
            {
                Bucket: "" + process.env.REACT_APP_S3_BUCKET_NAME,
                Key: fname,
                Body: data,
                ACL: "public-read",
            },
            function (err) {
                if (err) reject(err);
                var options = {
                    keypairId: process.env.REACT_APP_CLOUDFRONT_ACCESS_KEY_ID,
                    privateKeyString:
                        process.env.REACT_APP_CLOUDFRONT_PRIVATE_KEY_STRING.replace(
                            /\\n/g,
                            "\n"
                        ),
                };
                awsCloudFront.getSignedUrl(
                    process.env.REACT_APP_CLOUD_FRONT_ORIGIN_PATH + fname,
                    options
                );
                resolve(process.env.REACT_APP_CLOUD_FRONT_ORIGIN_PATH + fname);
            }
        );
    });
};

export const getAwsMetaData = async (url) => {
    try {
        const res = await axios.get(url);
        return res.data;
    } catch (e) {
        return null;
    }
};
