import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import { Stream } from "../../islands/video.tsx";

type context = {
  jwt:string,
  id:string,
};

export const handler: Handlers = {
  GET: async (req: Request, ctx: FreshContext<context>) => {
    const { auth } = getCookies(req.headers);
    const {id} = ctx.params;
    return ctx.render({jwt:auth,id:id});
  },
};

export default function Page(props: PageProps<context>) {
  return (
    <div class="">
        <Stream jwt={props.data.jwt} id={props.data.id}/>
    </div>
  );
}