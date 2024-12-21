import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";

type context = {
  message: string;
};

export const handler: Handlers = {
  GET: (req: Request, ctx: FreshContext<context>) => {
    return ctx.render({});
  },
  POST: async (req: Request, ctx: FreshContext<context>) => {
    const form = await req.formData();
    const email = form.get("email");
    const password = form.get("password");
    const api = Deno.env.get("API_URL");
    if (!api || api == "") {
      return ctx.render({ message: "No API_URL found" });
    }

    const res = await fetch(api + "checkuser", {
      headers: {
        "Content-Type": "aplication/json",
      },
      method: "POST",
      body: JSON.stringify({email, password}),
    });

    if (res.status == 200) {
      const data = await res.json() as user;
      const secret = Deno.env.get("SECRET");
      if (!secret || secret == "") {
        return ctx.render({ message: "No SECRET found" });
      }
      const token = jwt.sign(
        {
          email,
          id: data.id,
          name: data.name,
        },
        secret,
        {
          expiresIn: "24h",
        },
      );

      const headers = new Headers();
      const url = new URL(req.url);

      setCookie(headers, {
        name: "auth",
        value: token,
        sameSite: "Lax",
        domain: url.hostname,
        path: "/",
        secure: true,
      });

      headers.set("location", "/videos");
      return new Response(null, {
        status: 303,
        headers,
      });
    } else if (res.status == 400 || res.status == 404) {
      return ctx.render({ message: "User not found" });
    } else {
      return ctx.render({ message: "Internal Error" });
    }
  },
};

export default function Page(props: PageProps<context>) {
  return (
    <div class="fullpage">
      <div class="centerform">
        <img src="" alt="" />
        <h2>WECAMWEB</h2>
        <form method="POST" action="/register" class="loginform">
          <label form="Nombre">Nombre</label>
          <input type="" id="name" name="name" required="" />
          <label form="Usuario">Usuario</label>
          <input type="" id="email" name="email" required="" />
          <label form="Password">Password</label>
          <input type="Password" id="password" name="password" required="" />
          <button type="submit">ENTRAR</button>
        </form>
      </div>
    </div>
  );
}
