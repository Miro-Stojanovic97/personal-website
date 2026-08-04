// import React from "react";
import ResumeViewer from "@/components/ResumeViewer";
import Scroll_Page from "@/components/ScrollPage";

export default function Job_Experience() {
  const entityName = "Work Tent";
  const body = (
    <>
      <h1>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;I am a full-stack software engineer with a strong background in web development
        and a passion for creating clean user experiences. I have experience working with
        various technologies, including React, Next.js, Node.js, and more. My professional
        journey has allowed me to contribute to multiple projects, enhancing my skills in
        both front-end and back-end development. See my resume below:
      </h1>
      <ResumeViewer />
    </>
  );

  return <Scroll_Page entityName={entityName} body={body} bodyClassName="absolute top-[10%] left-[5%] w-[90%] md:top-[12%] md:left-[10%] md:w-[80%] h-[82%] overflow-y-auto p-4 md:p-10" />;
}