import { headers } from "next/headers";

export async function getPathnameFromHeaders() {
  const headersList = await headers();
  const url = headersList.get("x-url");
  return new URL(url || "").pathname;
}
