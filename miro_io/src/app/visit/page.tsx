// import React from "react";
import Scroll_Page from "@/components/ScrollPage";
import Image from "next/image";
import Link from "next/link";

export default function Visit() {
  const entityName = "Kayak";
  const body = (
    <>
      <h1>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Enter the Kayak and adventure to other parts of the Internet Sea,
        like the Islands of LinkedIn and GitHub (by clicking on the icon below)
      </h1><br/>
      <div className="flex flex-wrap items-center gap-4 p-4 lg:p-35 lg:gap-10 justify-center bg-blue-400 overflow-hidden border-1 border-black">
        <a
          href="https://www.linkedin.com/in/mirostojanovic/"
          className="bg-[#FBDDB5] rounded-full p-6 hover:transform hover:scale-110 transition-transform"
          >
          <Image
            src="/LinkedIn_icon.svg"
            alt="LinkedIn Icon"
            width={80}
            height={80}
          />
        </a>
        <a 
        href="https://github.com/Miro-Stojanovic97"
        className="bg-[#FBDDB5] rounded-full p-5 hover:transform hover:scale-110 transition-transform"
        >
          <Image
            src="/github.svg"
            alt="GitHub Icon"
            width={80}
            height={80}
          />
        </a>
        <a 
        href="https://github.com/Miro-Stojanovic97"
        className="bg-[#FBDDB5] rounded-full hover:transform hover:scale-110 transition-transform"
        >
          <Image
            src="/palm_tree.png"
            alt="Palm Tree Icon"
            width={80}
            height={80}
          />
        </a>
      </div>   
    </>
  );

  return <Scroll_Page entityName={entityName} body={body} bodyClassName="absolute top-[12%] left-[10%] w-[80%] h-[80%] overflow-y-auto p-10" />;
}