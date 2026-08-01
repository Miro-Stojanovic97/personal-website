// import React from "react";
import Image from "next/image";
import Link from "next/link";
import Scroll_Page from "@/components/ScrollPage";

export default function Basketball() {
  const entityName = "Basketball Court";
  const body = (
    <>
      <h1>My favorite sport to play and watch is Basketball. I play at least once per week,
        and I'm also a huge fan of the Milwaukee Bucks and NBA.
        You can also find me playing NBA 2K, which you may have already discovered by exploring the camp.
      </h1>
      <br/><h1>[Photo of Me Watching Bucks game]</h1>
    </>
  );

  return (
    <Scroll_Page entityName={entityName} body={body} />
  );
}