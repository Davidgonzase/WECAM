import { FunctionComponent } from "https://esm.sh/v128/preact@10.22.0/src/index.js";
import { cam, camsresponse } from "../types.ts";
import type { Signal } from "@preact/signals";

type context = {
  videos: Signal<cam[]>;
  req: string;
};

export const Camsdiv: FunctionComponent<context> = (props) => {
  async function errase(id: string) {
    const response = await fetch("/api/deletecam", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ jwttoken: props.req, cameraid: id}),
    });
    const response2 = await fetch("/api/getcams", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ jwttoken: props.req }),
    });
    const camscontent = await response2.json() as camsresponse;
    props.videos.value = camscontent.content;
  }

  return (
    <div class="cameras-container">
      {props.videos.value.map((element) => (
        <div class="cams">
          <a href={"/cameras/" + element._id}>
            {element.name}
          </a>
          <button onClick={() => errase(element._id)}>BORRAR</button>
        </div>
      ))}
    </div>
  );
};
