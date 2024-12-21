import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";

type context = {
  message: string;
};

export const handler: Handlers = {
  GET: (req: Request, ctx: FreshContext<context>) => {
    return ctx.render({});
  },
  POST: async (req: Request, ctx: FreshContext<context>) => {
    const form = await req.formData();
    const mail = form.get("mail");
    const password = form.get("password");
    console.log(mail,password)
    return ctx.render({});
  },
};

export default function Page(props: PageProps<context>) {
  return (
    <div class="fullpage">
      <div class="centerform">
        <img src="" alt="" />
        <h2>WECAMWEB</h2>
        <form method="POST" action="/login" class="loginform">
          <label form="Usuario">Usuario</label>
          <input type="" id="mail" name="mail" required=""/>
          <label form="Password">Password</label>
          <input type="Password" id="password" name="password" required=""/>
          <button type="submit">ENTRAR</button>
        </form>
        <a href="/register">Make an account</a>
      </div>
    </div>
  );
}