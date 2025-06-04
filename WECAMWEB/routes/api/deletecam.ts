import { HandlerContext } from "$fresh/server.ts";

export const handler = async (req: Request, _context: HandlerContext): Promise<Response> => {
  const { jwttoken,cameraid } = await req.json(); 
  const api = Deno.env.get("API_URL");
  try {
    const camsapi = await fetch(api + "deletecam", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "DELETE",
      body: JSON.stringify({ jwttoken,cameraid}),
    });

    if (!camsapi.ok) {
      throw new Error();
    }
    return new Response("true");
  } catch (error) {
    console.error(error);
    return new Response("Error fetching cams", { status: 500 });
  }
};