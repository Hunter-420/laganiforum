import { createHash } from "crypto";

export function hashIp(ip: string): string {
  const salt = process.env.ANALYTICS_SALT || "laganiforum-analytics";
  return createHash("sha256").update(`${ip}:${salt}`).digest("hex");
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") || "unknown";
}
