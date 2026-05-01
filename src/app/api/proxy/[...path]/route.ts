import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import https from "https";

const agent = new https.Agent({ rejectUnauthorized: false });

const backend = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://localhost:8443",
  httpsAgent: agent,
  validateStatus: () => true,
  maxRedirects: 0,
});

const HOP_BY_HOP = new Set([
  "transfer-encoding",
  "connection",
  "content-encoding",
  "keep-alive",
]);

async function proxy(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const url = "/v1/" + path.join("/") + req.nextUrl.search;

  const headers: Record<string, string> = {};
  req.headers.forEach((v, k) => {
    headers[k] = v;
  });
  headers["host"] = "localhost:8443";

  const body = ["POST", "PUT", "PATCH"].includes(req.method || "")
    ? await req.text()
    : undefined;

  const res = await backend.request({
    url,
    method: req.method,
    headers,
    data: body,
    responseType: "arraybuffer",
  });

  const responseHeaders = new Headers();
  Object.entries(res.headers).forEach(([key, value]) => {
    if (HOP_BY_HOP.has(key.toLowerCase())) return;
    if (typeof value === "string") {
      responseHeaders.set(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((v) => responseHeaders.append(key, v));
    }
  });

  return new NextResponse(res.data, {
    status: res.status,
    statusText: res.statusText,
    headers: responseHeaders,
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const DELETE = proxy;
export const PATCH = proxy;
export const OPTIONS = proxy;
export const HEAD = proxy;
