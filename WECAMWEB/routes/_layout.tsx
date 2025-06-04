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
          <a href="/detections">Detections</a>
          <a>About us</a>
        </div>
        <button class="logout-button" onClick="window.location.href='/logout'">Logout</button>
      </div>
      <Component/>
    </div>
  );
};

export default Layout;
