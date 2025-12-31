import kv from "@/lib/kv";
import { now } from "@/lib/time";

export async function GET(req, { params }) {
  const paste = await kv.get(`paste:${params.id}`);

  if (!paste) return Response.json({}, { status: 404 });

  const current = now(req);

  if (paste.expiresAt && current >= paste.expiresAt)
    return Response.json({}, { status: 404 });

  if (paste.maxViews && paste.views >= paste.maxViews)
    return Response.json({}, { status: 404 });

  paste.views += 1;
  await kv.set(`paste:${params.id}`, paste);

  return Response.json({
    content: paste.content,
    remaining_views: paste.maxViews
      ? Math.max(0, paste.maxViews - paste.views)
      : null,
    expires_at: paste.expiresAt
      ? new Date(paste.expiresAt).toISOString()
      : null
  });
}
