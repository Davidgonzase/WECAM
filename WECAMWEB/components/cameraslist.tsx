import { FunctionComponent } from "https://esm.sh/v128/preact@10.22.0/src/index.js";
import { cam } from "../types.ts";

type context = {
  videos: cam[];
  req:string
};

export const Camsdiv: FunctionComponent<context> = (props) => {
  return (
    <div class="divscontainer">
      {props.videos.map((element) => {
        return (
          <a class="cams" href={"/cameras/" + element._id}>{element.name}<button>BORRAR</button></a>
        );
      })}
    </div>
  );
};
