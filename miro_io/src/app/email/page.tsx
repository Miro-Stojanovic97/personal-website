// import React from "react";
import Scroll_Page from "@/components/ScrollPage";

export default function Email() {
  const entityName = "Fire";
  const body = (
    <>
      <h1>
        [Toss a flare into the fire to send a signal (Email), and you&apos;ll get a response asap.]
      </h1><br/>


      <h1>
        [Pic of my LinkedIn and GitHub profiles]
      </h1>
    </>
  );

  return <Scroll_Page entityName={entityName} body={body} bodyClassName="absolute top-[20%] left-[10%] w-[80%] h-[80%] overflow-y-auto p-10" />;
}