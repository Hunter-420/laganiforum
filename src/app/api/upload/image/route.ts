import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/azure-storage";
import { verifySession } from "@/lib/auth";
import sharp from "sharp";
import { getDb } from "@/lib/db";
import { MediaDocument } from "@/lib/types/db";

export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get("session")?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Invalid file type. Only images are allowed." }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const originalBuffer = Buffer.from(arrayBuffer);

    // Compress the image
    let compressedBuffer: any = originalBuffer;
    let contentType = file.type;

    try {
      compressedBuffer = await sharp(originalBuffer)
        .webp({ quality: 80 })
        .toBuffer();
      contentType = "image/webp";
    } catch (sharpError) {
      console.warn("Sharp compression failed, falling back to original buffer:", sharpError);
    }

    // Upload to Azure
    const url = await uploadImage(compressedBuffer, file.name.replace(/\.[^/.]+$/, "") + ".webp", contentType);

    // Save metadata to MongoDB
    const db = await getDb();
    const mediaDoc: MediaDocument = {
      url,
      fileName: file.name,
      contentType,
      sizeBytes: compressedBuffer.length,
      uploadedAt: new Date(),
    };
    
    await db.collection("media").insertOne(mediaDoc);

    return NextResponse.json({ url });
  } catch (error: any) {
    console.error("Image upload failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}
