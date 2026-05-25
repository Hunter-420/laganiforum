import { NextRequest } from "next/server";
import { env } from "@/lib/env";

export function validateAutomationApiKey(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const apiKey =
    request.headers.get("x-api-key") ||
    (authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : authHeader);

  if (!env.AUTOMATION_API_KEY || !apiKey) return false;
  return apiKey === env.AUTOMATION_API_KEY;
}
