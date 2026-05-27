import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { env } from '../config/env';

let _containerClient: ContainerClient | null = null;

function getContainerClient(): ContainerClient {
  if (!_containerClient) {
    const client = BlobServiceClient.fromConnectionString(env.AZURE_STORAGE_CONNECTION_STRING);
    _containerClient = client.getContainerClient(env.AZURE_STORAGE_CONTAINER);
  }
  return _containerClient;
}

export async function uploadBlob(buffer: Buffer, blobName: string, contentType: string): Promise<string> {
  const containerClient = getContainerClient();
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.upload(buffer, buffer.length, {
    blobHTTPHeaders: { blobContentType: contentType },
  });
  return blockBlobClient.url;
}

export async function deleteBlob(blobName: string): Promise<void> {
  const containerClient = getContainerClient();
  await containerClient.getBlockBlobClient(blobName).deleteIfExists();
}
