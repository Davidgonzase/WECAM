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
    const name = form.get("name");
    const password = form.get("password");
    const api = Deno.env.get("API_URL");
    if (!api || api == "") {
      return ctx.render({ message: "No API_URL found" });
    }

    const res = await fetch(api + "newuser", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ name:name, email:email, password:password }),
    });

    const data = await res.json();

    if (data.status == 200) {
      const reslogin = await fetch(api + "login", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ email:email, password:password }),
      });

      const datalogin = await reslogin.json();

      if(datalogin.status == 200){

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

      }else{
        return ctx.render({message:"INTERNAL ERROR"})
      }

    } else {
      if(data.error){
        return ctx.render({ message: data.error});
      }
      return ctx.render({message:"INTERNAL ERROR"})
    }
  },
};

export default function Page(props: PageProps<context>) {
  return (
    <div class="fullpagecenter">
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
          <button class="button-l-r" type="submit">ENTRAR</button>
          <p class="error-message">{props.data.message}</p>
        </form>
      </div>
    </div>
  );
}
