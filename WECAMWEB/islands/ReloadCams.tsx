import { FunctionComponent } from "preact";
import { cam, camsresponse } from "../types.ts";
import type { Signal } from "@preact/signals";

type context = {
  videos: Signal<cam[]>;
  req:string
};

export const Reload: FunctionComponent<context> = (props) => {
  async function reload() {
    const response = await fetch("/api/getcams", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ jwttoken: props.req }),
      });
    const camscontent = await response.json() as camsresponse;
    props.videos.value=camscontent.content
  }
  return <button class="reload" onClick={() =>{reload()}}>RELOAD</button>;
};