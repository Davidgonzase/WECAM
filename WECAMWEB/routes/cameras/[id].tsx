import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import { Stream } from "../../islands/video.tsx";

type context = {
  jwt:string,
  id:string,
  name:string
};

export const handler: Handlers = {
  GET: async (req: Request, ctx: FreshContext<context>) => {
    const { auth } = getCookies(req.headers);
    const {id} = ctx.params;
    const api = Deno.env.get("API_URL");
    const res = await fetch(api + "camera", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jwttoken: auth, cameraid: id}),
    });
    const data = await res.json();
    return ctx.render({jwt:auth,id:id,name:data.content.name});
  }

};

export default function Page(props: PageProps<context>) {
  return (
    <div class="centerall">
      <Stream jwt={props.data.jwt} id={props.data.id} name={props.data.name}/>
    </div>
  );
}