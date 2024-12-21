import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";

type context = {
    
};

export const handler: Handlers = {
  GET: (req: Request, ctx: FreshContext<context>) => {
    return ctx.render({});
  },
  POST: async (req: Request, ctx: FreshContext<context>) => {

  },
};

export default function Page(props: PageProps<context>) {
  return (
    <div class="fullpage">
    </div>
  );
}
