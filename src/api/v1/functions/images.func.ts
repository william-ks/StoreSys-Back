import { compareSync } from "bcrypt";
import s3 from "../../services/s3";

interface upload {
  buffer: string;
  mimetype: string;
  originalname: string;
  path: string;
}

export const upload = async ({
  buffer,
  mimetype,
  originalname,
  path,
}: upload) => {
  if (!buffer || !mimetype || !originalname || !path) {
    throw new Error("Faltando dados.");
  }

  try {
    const Files = await s3
      .upload({
        Bucket: process.env.BUCKET as string, //buscar do .env
        Key: `${path}/${originalname}`,
        Body: buffer,
        ContentType: mimetype,
      })
      .promise();

    const link = Files.Location.split(".com")[1];

    return {
      url: `https://f004.backblazeb2.com/file${link}`,
      path: Files.Key,
    };
  } catch (e: any) {
    throw new Error(e);
  }
};

export const list = async () => {
  const Files = await s3
    .listObjects({
      Bucket: process.env.BUCKET as string,
    })
    .promise();

  const archives = Files.Contents?.map((file) => {
    return {
      url: `https://f004.backblazeb2.com/file/${process.env.BUCKET}/${file.Key}`,
      path: file.Key,
    };
  });

  return archives;
};

export const del = async (path: string) => {
  await s3
    .deleteObject({
      Bucket: process.env.BUCKET as string,
      Key: path,
    })
    .promise();
};
