export const env = {
  MONGODB_URI: process.env.MONGODB_URI || "",
  AZURE_STORAGE_ACCOUNT_NAME: process.env.AZURE_STORAGE_ACCOUNT_NAME || "",
  AZURE_STORAGE_ACCOUNT_KEY: process.env.AZURE_STORAGE_ACCOUNT_KEY || "",
  AZURE_STORAGE_CONTAINER_NAME: process.env.AZURE_STORAGE_CONTAINER_NAME || "",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "admin@laganiforum.com",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "password123",
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "",
  JWT_SECRET: process.env.JWT_SECRET || "super-secret-key-for-jwt-signing-12345",
  AUTOMATION_API_KEY: process.env.AUTOMATION_API_KEY || "",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
};

export function validateEnv() {
  const required = [
    "MONGODB_URI",
    "AZURE_STORAGE_ACCOUNT_NAME",
    "AZURE_STORAGE_ACCOUNT_KEY",
    "AZURE_STORAGE_CONTAINER_NAME",
    "ADMIN_EMAIL",
    "ADMIN_PASSWORD",
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.warn(`Missing required environment variables: ${missing.join(", ")}`);
  }
}
