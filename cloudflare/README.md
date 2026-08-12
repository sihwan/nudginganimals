# Nudging Turtle subscription route

This Worker handles only the homepage subscription endpoint:

- Public path: `https://nudginganimals.com/api/subscribe`
- Upstream API: `https://turtle.nudginganimals.com/api/subscribe`

Cloudflare setup:

1. Create a Worker and paste `subscribe-worker.js`.
2. Add a Worker route: `nudginganimals.com/api/subscribe*`.
3. Make the `nudginganimals.com` DNS A records proxied in Cloudflare.
4. If you also serve `www.nudginganimals.com`, add `www.nudginganimals.com/api/subscribe*` and proxy the `www` record too.

This avoids exposing the private recipient email in the website and avoids making visitors resolve the `turtle` subdomain directly.
