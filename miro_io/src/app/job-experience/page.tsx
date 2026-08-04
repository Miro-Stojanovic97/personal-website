// import React from "react";
import Scroll_Page from "@/components/ScrollPage";

export default function Job_Experience() {
  const entityName = "Work Tent";
  const body = (
    <>
      <h1>I am a full-stack software engineer with a strong background in web development
        and a passion for creating clean user experiences. I have experience working with
        various technologies, including React, Next.js, Node.js, and more. My professional
        journey has allowed me to contribute to multiple projects, enhancing my skills in
        both front-end and back-end development.
      </h1>
      <br/><h1>[Resume]</h1>
    </>
  );

  return <Scroll_Page entityName={entityName} body={body} bodyClassName="absolute top-[20%] left-[10%] w-[80%] h-[80%] overflow-y-auto p-10" />;
}