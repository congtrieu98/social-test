export function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  // if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  // return "http://localhost:3000";
  return process.env.NEXT_PUBLIC_BASE_URL
}

export function getUrl() {
  return getBaseUrl() + "/api/trpc";
}