const TURTLE_SUBSCRIBE_API = "https://turtle.nudginganimals.com/api/subscribe";
const ALLOWED_ORIGINS = new Set([
  "https://nudginganimals.com",
  "https://www.nudginganimals.com",
]);

function getCorsHeaders(request) {
  const origin = request.headers.get("Origin") || "";
  const headers = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };

  if (ALLOWED_ORIGINS.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers.Vary = "Origin";
  }

  return headers;
}

function jsonResponse(request, status, payload) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...getCorsHeaders(request),
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname !== "/api/subscribe") {
      return jsonResponse(request, 404, { ok: false, message: "Not found" });
    }

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: getCorsHeaders(request),
      });
    }

    if (request.method !== "POST") {
      return jsonResponse(request, 405, {
        ok: false,
        message: "허용되지 않은 요청입니다.",
      });
    }

    try {
      const upstream = await fetch(TURTLE_SUBSCRIBE_API, {
        method: "POST",
        headers: {
          "Content-Type": request.headers.get("Content-Type") || "application/json",
          "Origin": url.origin,
        },
        body: await request.text(),
      });

      return new Response(await upstream.text(), {
        status: upstream.status,
        headers: {
          ...getCorsHeaders(request),
          "Content-Type": upstream.headers.get("Content-Type") || "application/json; charset=utf-8",
          "Cache-Control": "no-store",
        },
      });
    } catch (error) {
      return jsonResponse(request, 502, {
        ok: false,
        message: "전송에 실패했습니다. 잠시 뒤 다시 시도해주세요.",
      });
    }
  },
};
