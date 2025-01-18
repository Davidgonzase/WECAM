import { HandlerContext } from "$fresh/server.ts";

export const handler = async (req: Request, _context: HandlerContext): Promise<Response> => {
  const { jwttoken } = await req.json(); 
  const api = Deno.env.get("API_URL");
  try {
    const camsapi = await fetch(api + "getcams", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ jwttoken }),
    });

    if (!camsapi.ok) {
      throw new Error();
    }

    const camscontent = await camsapi.json();
    return new Response(JSON.stringify(camscontent), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response("Error fetching cams", { status: 500 });
  }
};