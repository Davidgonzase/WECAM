import { HandlerContext } from "$fresh/server.ts";
import { warningtype } from "../../types.ts";

export const handler = async (req: Request, _context: HandlerContext): Promise<Response> => {
  const { jwttoken,cameraid,warningid } = await req.json(); 
  const api = Deno.env.get("API_URL");
  try {
    const detectapi = await fetch(api + "deletewarning", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "DELETE",
      body: JSON.stringify({ jwttoken,cameraid,warningid }),
    });
    if (!detectapi.ok) {
      throw new Error();
    }
    return new Response("true");
  } catch (error) {
    console.error(error);
    return new Response("Error fetching cams", { status: 500 });
  }
};