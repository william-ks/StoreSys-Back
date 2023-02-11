import aws from "aws-sdk";

const endpoint = new aws.Endpoint(process.env.ENDPOINT_S3 as string);

const s3 = new aws.S3({
  endpoint,
  credentials: {
    accessKeyId: process.env.KEY_ID as string,
    secretAccessKey: process.env.APP_KEY as string,
  },
});

export default s3;
