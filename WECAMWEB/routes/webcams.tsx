import { FreshContext, Handlers, PageProps } from "$fresh/src/server/types.ts";
import { user } from "../types.ts";

export type context = {
  name:string 
};


export const handler: Handlers = {
  GET: async (req: Request, ctx: FreshContext<user,context>) => {
    return ctx.render({name:ctx.state.name});
  },
};



export default function Page(props: PageProps<context>) {
  return (
    <div class="fullpage">
      {props.data.name}
    </div>
  );
}
