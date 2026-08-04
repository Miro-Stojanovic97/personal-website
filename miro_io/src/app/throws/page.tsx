// import React from "react";
import Scroll_Page from "@/components/ScrollPage";
import Image from "next/image";

export default function Throws() {
  const entityName = "Throwing Circle";
  const body = (
    <div style={{ fontSize: "clamp(0.8rem, min(2.8vw, 2vh), 1.1rem)" }}>
      <h1>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;In my free time during the Spring, I coach track & field throwing at a local high school.
        So far, 6 of my athletes have qualified for the state meet, and 1 has become a state medalist,
        pictured below at the State Championships. Most importantly to me, 3 of my athletes have gone
        on to compete athletically in college! :)
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