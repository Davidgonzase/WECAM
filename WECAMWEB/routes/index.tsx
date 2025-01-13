import { FreshContext, Handlers } from "$fresh/src/server/types.ts";

export const handler: Handlers = {
  GET: () => {
    const headers = new Headers();
    headers.set("location", "/login");
    return new Response(null, {
      status: 303,
      headers,
    });
  },
};