import { FunctionComponent } from "https://esm.sh/v128/preact@10.22.0/src/index.js";
import { warningtype } from "../types.ts";
import type { Signal } from "@preact/signals";


type context = {
  warnings: Signal<warningtype[]>;
  req:string
};

export const Warningdiv: FunctionComponent<context> = (props) => {
  async function errase(id: string, idwarning: string) {
    const response = await fetch("/api/deletewarnings", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ jwttoken: props.req, cameraid: id, warningid:idwarning}),
    });
    const response2 = await fetch("/api/getwarnings", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "DELETE",
      body: JSON.stringify({ jwttoken: props.req}),
    });
    const camscontent = await response2.json() as warningtype[];
    props.warnings.value = camscontent;
  }
  return (
    <div class="detectionlist">
      {props.warnings.value.map((element) =>
        element.detections.map((w) => (
          <div class="detection">
            <p>Camera: {element.camara}</p>
            <p>Hour: {w.hour}</p>
            <p>ID: {w._id}</p>
            <button onClick={() => errase(element.camaraid,w._id)}>BORRAR</button>
          </div>
        ))
      )}
    </div>
  );
};
