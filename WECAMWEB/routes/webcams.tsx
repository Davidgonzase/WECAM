import { FreshContext, Handlers, PageProps } from "$fresh/src/server/types.ts";
import { getCookies } from "$std/http/cookie.ts";
import { Camsdiv } from "../components/cameraslist.tsx"
import { user,camsresponse,cam} from "../types.ts";

export type context = {
  arrid:cam[] 
};


export const handler: Handlers = {
  GET: async (req: Request, ctx: FreshContext<user,context>) => {
    const api = Deno.env.get("API_URL");
    if (!api || api == "") {
      return ctx.render();
    }
    const { auth } = getCookies(req.headers);
    const camsapi = await fetch(api + "getcams", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ jwttoken:auth }),
    });
    const camscontent = await camsapi.json() as camsresponse;
    return ctx.render({arrid:camscontent.content});
  },
};



export default function Page(props: PageProps<context>) {
  return (
    <div class="fullpagenotcenter">
      <Camsdiv videos={props.data.arrid} />
    </div>
  );
}
