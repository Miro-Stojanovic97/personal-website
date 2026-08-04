// import React from "react";
import Scroll_Page from "@/components/ScrollPage";
import Image from "next/image";
import Link from "next/link";

export default function Visit() {
  const entityName = "Kayak";
  const body = (
    <>
      <h1>
        Enter the Kayak and adventure to other parts of the Internet Sea,
        like the Islands of LinkedIn and GitHub (by clicking on the icon below)
      </h1><br/>

      <div className="mx-auto flex w-full max-w-[520px] flex-wrap items-center justify-center gap-6">
        <Link
          href="https://www.linkedin.com/in/mirostojanovic/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open LinkedIn"
          className="flex aspect-square w-[min(230px,46vw)] items-center justify-center rounded-2xl border-2 border-black/70 bg-[#f7ead3] p-0 shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#fff7eb]"
        >
          <Image
            src="/linkedin.png"
            alt="LinkedIn icon"
            width={200}
            height={200}
            className="h-full w-full object-contain"
          />
        </Link>
        <Link
          href="https://github.com/Miro-Stojanovic97"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open GitHub"
          className="flex aspect-square w-[min(230px,46vw)] items-center justify-center rounded-2xl border-2 border-black/70 bg-[#f7ead3] p-0 shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#fff7eb]"
        >
          <Image
            src="/github.png"
            alt="GitHub icon"
            width={200}
            height={200}
            className="h-full w-full object-contain"
          />
        </Link>
      </div>
    </>
  );

  return <Scroll_Page entityName={entityName} body={body} bodyClassName="absolute top-[12%] left-[10%] w-[80%] h-[80%] overflow-y-auto p-10" />;
}