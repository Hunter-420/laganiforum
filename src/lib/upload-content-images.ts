export async function uploadBase64ImagesInContent(html: string): Promise<string> {
  const base64Regex = /src="(data:image\/[^;]+;base64,[^"]+)"/g;
  const matches = [...html.matchAll(base64Regex)];

  if (matches.length === 0) return html;

  let result = html;

  for (const match of matches) {
    const base64DataUrl = match[1];

    try {
      const response = await fetch(base64DataUrl);
      const blob = await response.blob();
      const file = new File([blob], `inline-image-${Date.now()}.webp`, {
        type: blob.type || "image/webp",
      });

      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        console.error("Failed to upload base64 image:", await uploadRes.text());
        continue;
      }

      const { url } = await uploadRes.json();
      result = result.replace(base64DataUrl, url);
    } catch (err) {
      console.error("Error processing base64 image:", err);
    }
  }

  return result;
}
