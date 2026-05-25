import { getDb } from "@/lib/db";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ImageIcon } from "lucide-react";
import type { MediaDocument } from "@/lib/types/db";

export default async function MediaLibraryPage() {
  const session = await verifySession();
  if (!session) {
    redirect("/login");
  }

  const db = await getDb();
  const media = await db.collection("media").find({}).sort({ uploadedAt: -1 }).toArray() as unknown as MediaDocument[];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Media Library</h1>
          <p className="text-muted-foreground text-sm">View and manage uploaded images and documents.</p>
        </div>
      </div>

      <div className="bg-card border rounded-xl shadow-sm p-6">
        {media.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No media files uploaded yet. Upload images via the post editor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {media.map((file) => (
              <div key={file.url} className="group relative rounded-xl border overflow-hidden bg-muted aspect-square">
                {file.contentType.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={file.url} alt={file.fileName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                    <span className="text-xs font-semibold truncate w-full">{file.fileName}</span>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs text-white px-2 truncate max-w-[90%]">{file.fileName}</span>
                    <span className="text-[10px] text-white/70">
                      {Math.round(file.sizeBytes / 1024)} KB
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
