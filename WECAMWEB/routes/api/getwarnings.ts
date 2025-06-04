import { HandlerContext } from "$fresh/server.ts";
import { warningtype } from "../../types.ts";

export const handler = async (req: Request, _context: HandlerContext): Promise<Response> => {
  const { jwttoken } = await req.json(); 
  const api = Deno.env.get("API_URL");
  try {
    const detectapi = await fetch(api + "getdetections", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ jwttoken }),
    });
    const result = await detectapi.json();
    const detectcontent = result.content as warningtype[];

    return new Response(JSON.stringify(detectcontent), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response("Error fetching cams", { status: 500 });
  }
};