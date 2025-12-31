import kv from "@/lib/kv";
import { nanoid } from "nanoid";

export async function POST(req) {
  const body = await req.json();

  if (!body.content || typeof body.content !== "string") {
    return Response.json({ error: "Invalid content" }, { status: 400 });
  }

  if (body.ttl_seconds && body.ttl_seconds < 1) {
    return Response.json({ error: "Invalid ttl" }, { status: 400 });
  }

  if (body.max_views && body.max_views < 1) {
    return Response.json({ error: "Invalid max_views" }, { status: 400 });
  }

  const id = nanoid(8);
  const now = Date.now();

  const paste = {
    id,
    content: body.content,
    createdAt: now,
    expiresAt: body.ttl_seconds ? now + body.ttl_seconds * 1000 : null,
    maxViews: body.max_views ?? null,
    views: 0
  };

  await kv.set(`paste:${id}`, paste);

  return Response.json({
    id,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/p/${id}`
  });
}
