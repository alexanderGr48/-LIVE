
export async function onRequest(context) {
  const { request, env } = context;
  const cookie = request.headers.get("Cookie") || "";

  let visitor = cookie.match(/TAS_VISITOR=([a-f0-9-]+)/)?.[1];

  if (!visitor) {
    visitor = crypto.randomUUID();
  }

  const key = "ban:" + visitor;

  if (request.method === "POST") {
    await env.TAS_BANS.put(key, "banned", {
      expirationTtl: 2700
    });

    return new Response("Banned for 45 minutes", {
      headers: {
        "Set-Cookie": `TAS_VISITOR=${visitor}; Path=/; Max-Age=31536000; Secure; HttpOnly; SameSite=Lax`,
        "Cache-Control": "no-store"
      }
    });
  }

  if (request.method === "GET") {
    const banned = await env.TAS_BANS.get(key);

    return new Response(
      JSON.stringify({ banned: Boolean(banned) }),
      {
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": `TAS_VISITOR=${visitor}; Path=/; Max-Age=31536000; Secure; HttpOnly; SameSite=Lax`,
          "Cache-Control": "no-store"
        }
      }
    );
  }

  return new Response("Method not allowed", {
    status: 405
  });
}
