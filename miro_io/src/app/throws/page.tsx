// import React from "react";
import Scroll_Page from "@/components/ScrollPage";
import Image from "next/image";

export default function Throws() {
  const entityName = "Throwing Circle";
  const body = (
    <div style={{ fontSize: "clamp(0.8rem, min(2.8vw, 2vh), 1.1rem)" }}>
      <h1>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Sports have always been a big part of my life. 
        In college, I competed in Wrestling and outdoor Track & Field.
        Now, in my free time, I help coach my high school Track & Field throwing team, and continue to train
        in grappling sports like brazilian jiu-jitsu.</h1><br/>
      <h1>
        So far, 6 of my athletes have qualified for the state meet, and 1 was a state medalist,
        pictured below at the State Championships. Most importantly to me, many of my athletes have gone
        on to compete athletically in college! :). I really enjoy contributing to my community and the next
        generation in this way, as I benefited immensely from my teachers and coaches when I was growing up.
      </h1><br/>

      <Image
        src="/track-pic.jpg"
        alt="Photo of me coaching throws"
        width={300}
        height={200}
        className="mx-auto mt-[clamp(0.75rem,2vh,1.5rem)] h-auto rounded-lg border-2 border-black"
        style={{ width: "clamp(120px, min(50vw, 30vh), 300px)", height: "auto" }}
      />
    </div>
  );

  return <Scroll_Page entityName={entityName} body={body} bodyClassName="absolute top-[12%] left-[10%] w-[80%] h-[80%] overflow-y-auto p-10" />;
}