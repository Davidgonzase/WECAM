import { FreshContext, Handlers, PageProps } from "$fresh/src/server/types.ts";
import { getCookies } from "$std/http/cookie.ts";
import { useSignal } from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";
import { Camsdiv } from "../islands/cameraslist.tsx";
import { Reload } from "../islands/ReloadCams.tsx";
import { cam, camsresponse, user } from "../types.ts";

export type context = {
  arrid: cam[];
  auth: string;
};

export const handler: Handlers = {
  GET: async (req: Request, ctx: FreshContext<user, context>) => {
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
      body: JSON.stringify({ jwttoken: auth }),
    });
    const camscontent = await camsapi.json() as camsresponse;
    return ctx.render({ arrid: camscontent.content, auth: auth });
  },
};

export default function Page(props: PageProps<context>) {
  const cameras = useSignal<cam[]>(props.data.arrid);
  return (
    <div class="centerall">
      <div class="camerasdiv">
        <div class="uppercameras">
          <text>My cameras</text>
          <Reload req={props.data.auth} videos={cameras} />
        </div>
        <Camsdiv videos={cameras} />
      </div>
    </div>
  );
}
