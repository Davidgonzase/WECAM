import { FreshContext, Handlers, PageProps, RouteConfig } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";

type context = {
  message: string;
};


export const config: RouteConfig = {
  skipInheritedLayouts: true,
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

    const reslogin = await fetch(api + "login", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ email: email, password: password }),
    });

    const datalogin = await reslogin.json();

    if (datalogin.status == 200) {
      const headers = new Headers();
      const url = new URL(req.url);

      setCookie(headers, {
        name: "auth",
        value: datalogin.content.jwttoken,
        sameSite: "Lax",
        domain: url.hostname,
        path: "/",
        secure: true,
      });

      headers.set("location", "/webcams");
      return new Response(null, {
        status: 303,
        headers,
      });
    } else if (datalogin.error || datalogin.status !== 200) {
      return ctx.render({ message: datalogin.error });
    } else {
      return ctx.render({ message: "Internal error" });
    }
  },
};

export default function Page(props: PageProps<context>) {
  return (
    <div class="fullpage">
      <div class="one-third">
        <div class="login">
          <img src=""/>
          <h2>WECAMWEB</h2>
          <form method="POST" action="/login" class="loginform">
            <label form="Usuario">Usuario</label>
            <input type="Mail" id="email" name="email" required="" />
            <label form="Password">Password</label>
            <input type="Password" id="password" name="password" required="" />
            <p class="error-message">{props.data.message}</p>
            <button class="button-l-r" type="submit">Enter</button>
          </form>
          <p>Dont have an account?</p>
          <a href="/register">Register</a>
        </div>
        <div class="news">
          News and updates // Work in progress
        </div>
      </div>
    </div>
  );
}
