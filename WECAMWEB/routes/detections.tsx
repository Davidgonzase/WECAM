import { FreshContext, Handlers, PageProps } from "$fresh/src/server/types.ts";
import { getCookies } from "$std/http/cookie.ts";
import { useSignal } from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";
import { Warningdiv } from "../islands/warninglist.tsx";
import { Reload } from "../islands/ReloadCams.tsx";
import {  user, warningtype } from "../types.ts";

export type context = {
  arrid: warningtype[];
  auth: string;
};

export const handler: Handlers = {
  GET: async (req: Request, ctx: FreshContext<user, context>) => {
    const api = Deno.env.get("API_URL");
    if (!api || api == "") {
      return ctx.render();
    }
    const { auth } = getCookies(req.headers);
    const detectapi = await fetch(api + "getdetections", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ jwttoken: auth }),
    });
    const result = await detectapi.json();
    const detectcontent = result.content as warningtype[];
    return ctx.render({ arrid: detectcontent, auth: auth });
  },
};

export default function Page(props: PageProps<context>) {
  const warning_list = useSignal<warningtype[]>(props.data.arrid);
  return (
    <div class="centerall">
      <div class="camerasdiv">
        <div class="uppercameras">
          <text>Detections</text>
        </div>
        <Warningdiv warnings={warning_list} req={props.data.auth}/>
      </div>
    </div>
  );
}
