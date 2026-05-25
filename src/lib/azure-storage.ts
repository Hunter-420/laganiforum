import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
} from "@azure/storage-blob";
import { env } from "./env";

export function getBlobServiceClient() {
  if (!env.AZURE_STORAGE_ACCOUNT_NAME || !env.AZURE_STORAGE_ACCOUNT_KEY) {
    throw new Error("Azure Storage credentials missing");
  }

  const connectionString = `DefaultEndpointsProtocol=https;AccountName=${env.AZURE_STORAGE_ACCOUNT_NAME};AccountKey=${env.AZURE_STORAGE_ACCOUNT_KEY};EndpointSuffix=core.windows.net`;
  return BlobServiceClient.fromConnectionString(connectionString);
}

function generateSasUrl(blobName: string): string {
  const accountName = env.AZURE_STORAGE_ACCOUNT_NAME;
  const accountKey = env.AZURE_STORAGE_ACCOUNT_KEY;
  const containerName = env.AZURE_STORAGE_CONTAINER_NAME;

  const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

  const expiresOn = new Date();
  expiresOn.setFullYear(expiresOn.getFullYear() + 10);

  const sasToken = generateBlobSASQueryParameters(
    {
      containerName,
      blobName,
      permissions: BlobSASPermissions.parse("r"),
      expiresOn,
    },
    sharedKeyCredential
  ).toString();

  return `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;
}

export async function uploadImage(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  const blobServiceClient = getBlobServiceClient();
  const containerClient = blobServiceClient.getContainerClient(
    env.AZURE_STORAGE_CONTAINER_NAME
  );

  await containerClient.createIfNotExists();

  const uniqueName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const blockBlobClient = containerClient.getBlockBlobClient(uniqueName);

  await blockBlobClient.uploadData(fileBuffer, {
    blobHTTPHeaders: { blobContentType: contentType },
  });

  return generateSasUrl(uniqueName);
}
