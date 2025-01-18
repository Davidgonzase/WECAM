import { FunctionComponent } from "https://esm.sh/v128/preact@10.22.0/src/index.js";
import { cam } from "../types.ts";
import type { Signal } from "@preact/signals";

type context = {
  videos: Signal<cam[]>; 
};

export const Camsdiv: FunctionComponent<context> = ({ videos }) => {
  return (
    <div class="cameras-container">
      {videos.value.map((element) => (
        <a class="cams" href={"/cameras/" + element._id}>{element.name}</a>
      ))}
    </div>
  );
};