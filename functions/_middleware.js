
export async function onRequest(context) {
  const { request, env, next } = context;

  // Allow the ban API to process lock requests.
  if (new URL(request.url).pathname === "/api/ban") {
    return next();
  }

  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(/TAS_VISITOR=([a-f0-9-]+)/);

  if (match) {
    const visitor = match[1];
    const banned = await env.TAS_BANS.get("ban:" + visitor);

    if (banned) {
      return new Response(null, {
        status: 403,
        headers: {
          "Cache-Control": "no-store"
        }
      });
    }
  }

  return next();
}
