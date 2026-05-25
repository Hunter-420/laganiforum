import type { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { env } from "@/lib/env";
import { getBlobServiceClient } from "@/lib/azure-storage";

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Parse blob object name from our Azure SAS URL. Returns null for external URLs. */
export function parseAzureBlobName(url: string): string | null {
  if (!url?.trim() || !env.AZURE_STORAGE_ACCOUNT_NAME || !env.AZURE_STORAGE_CONTAINER_NAME) {
    return null;
  }

  try {
    const parsed = new URL(url);
    const expectedHost = `${env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`;
    if (parsed.hostname !== expectedHost) return null;

    const segments = parsed.pathname.split("/").filter(Boolean);
    if (segments[0] !== env.AZURE_STORAGE_CONTAINER_NAME || segments.length < 2) {
      return null;
    }

    return decodeURIComponent(segments.slice(1).join("/"));
  } catch {
    return null;
  }
}

function isManagedMediaUrl(url: string): boolean {
  return parseAzureBlobName(url) !== null;
}

async function deleteBlobByName(blobName: string): Promise<void> {
  const blobServiceClient = getBlobServiceClient();
  const containerClient = blobServiceClient.getContainerClient(
    env.AZURE_STORAGE_CONTAINER_NAME
  );
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.deleteIfExists();
}

async function removeMediaRecordsForBlob(blobName: string): Promise<void> {
  const account = env.AZURE_STORAGE_ACCOUNT_NAME;
  const container = env.AZURE_STORAGE_CONTAINER_NAME;
  const pathPrefix = `https://${account}.blob.core.windows.net/${container}/${blobName}`;

  const db = await getDb();
  await db.collection("media").deleteMany({
    url: { $regex: `^${pathPrefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}` },
  });
}

/** Drop URLs still referenced by other posts or author photos. */
export async function filterUnreferencedMediaUrls(
  urls: string[],
  excludePostId?: ObjectId
): Promise<string[]> {
  if (urls.length === 0) return [];

  const db = await getDb();
  const safe: string[] = [];

  for (const url of urls) {
    if (!isManagedMediaUrl(url)) continue;

    const postFilter: Record<string, unknown> = {
      $or: [
        { coverImage: url },
        { "affiliate.image": url },
        { content: { $regex: escapeRegex(url) } },
      ],
    };
    if (excludePostId) postFilter._id = { $ne: excludePostId };

    const usedInPost = await db.collection("posts").findOne(postFilter);
    if (usedInPost) continue;

    const settings = await db.collection("settings").findOne({
      authors: { $elemMatch: { photoUrl: url } },
    });
    if (settings) continue;

    safe.push(url);
  }

  return safe;
}

/** Delete Azure blob(s) and matching media collection rows. Skips non-Azure URLs. */
export async function deleteMediaUrls(urls: string[]): Promise<void> {
  const blobNames = new Set<string>();

  for (const url of urls) {
    if (!isManagedMediaUrl(url)) continue;
    const name = parseAzureBlobName(url);
    if (name) blobNames.add(name);
  }

  for (const blobName of blobNames) {
    try {
      await deleteBlobByName(blobName);
      await removeMediaRecordsForBlob(blobName);
    } catch (err) {
      console.error(`[media-storage] Failed to delete blob "${blobName}":`, err);
    }
  }
}
