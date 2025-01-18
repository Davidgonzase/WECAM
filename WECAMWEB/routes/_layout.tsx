import { PageProps } from "$fresh/src/server/mod.ts";
import { Logout } from "../islands/Logout.tsx";

const Layout = (props: PageProps) => {
  const Component = props.Component;
  return (
    <div>
      <div class="menudiv">
        <p>WECAMWEBB</p>
        <div>
          <a href="/webcams">Webcams</a>
          <a>User</a>
          <a>About us</a>
        </div>
        <Logout/>
      </div>
      <Component/>
    </div>
  );
};

export default Layout;
