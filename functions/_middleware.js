export async function onRequest(context) {
  const { request, env, next } = context;
  const pathname = new URL(request.url).pathname;

  // Allow the ban API and blocked page to load.
  if (pathname === "/api/ban" || pathname === "/blocked.html") {
    return next();
  }

  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(/TAS_VISITOR=([a-f0-9-]+)/);

  if (match) {
    const visitor = match[1];
    const banned = await env.TAS_BANS.get("ban:" + visitor);

    if (banned) {
      return Response.redirect(
        new URL("/blocked.html", request.url),
        302
      );
    }
  }

  return next();
}
