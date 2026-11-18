
const DESTINATION =
  "https://youtube.com/shorts/Yt_F2odTgPA?si=d0U5hcmywHO6cpaO";

export async function onRequest(context) {
  const { request, env, next } = context;
  const pathname = new URL(request.url).pathname;

  if (pathname === "/api/ban") {
    return next();
  }

  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(/TAS_VISITOR=([a-f0-9-]+)/);

  if (match) {
    const visitor = match[1];
    const banned = await env.TAS_BANS.get("ban:" + visitor);

    if (banned) {
      return Response.redirect(DESTINATION, 302);
    }
  }

  return next();
}
