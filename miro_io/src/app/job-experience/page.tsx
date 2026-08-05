// import React from "react";
import Image from "next/image";
// import ResumeViewer from "@/components/ResumeViewer";
import Scroll_Page from "@/components/ScrollPage";

export default function Job_Experience() {
  const entityName = "Work Tent";
  const body = (
    <>
      <h1>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;I am a full-stack software engineer with a strong background in web development
        and a passion for creating clean user experiences and solving interesting problems. See my resume below:
      </h1>
      <div className="relative w-full h-[52vh] md:h-[63vh] mt-2">
        <Image
          src="/resume.png"
          alt="Resume PNG"
          fill
          priority
          className="object-contain object-top"
        />
      </div>
    </>
  );

  return <Scroll_Page entityName={entityName} body={body} bodyClassName="absolute top-[10%] left-[5%] w-[90%] md:top-[12%] md:left-[10%] md:w-[80%] h-[82%] overflow-y-auto p-4 md:p-10" />;
}