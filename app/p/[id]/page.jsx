import kv from "@/lib/kv";

export default async function Page({ params }) {
  const paste = await kv.get(`paste:${params.id}`);

  if (!paste) {
    return <h1>404 - Paste not found</h1>;
  }

  return (
    <pre style={{ whiteSpace: "pre-wrap", padding: "20px" }}>
      {paste.content}
    </pre>
  );
}
