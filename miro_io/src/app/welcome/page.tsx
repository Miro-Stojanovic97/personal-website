// import React from "react";
import Scroll_Page from "@/components/ScrollPage";
import Image from "next/image";
import Link from "next/link";

export default function Welcome() {
  const entityName = "Shoreline";
  const body = (
    <>
      <h1>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Welcome to my website! My name is Miro.<br/>
        I&apos;m a software engineer based in Milwaukee, Wisconsin.
      </h1><br/>

      <h1>
        You are visitor #: [insert visitor count here]
      </h1><br/>

      <h1>
        If you&apos;d like to contact me directly from here, keep exploring the Island for ways to reach me:)
      </h1><br/>

      <h1>If you&apos;d prefer a modern layout instead of this island adventure,
        click my casual photo below:</h1>

      <Link href="/nav">
        <Image
          src="/me-fun.jpg"
          alt="Picture of Miro Stojanovic"
          width={200}
          height={200}
          className="mx-auto border-2 border-black rounded-2xl border-2 border-black/70 bg-[#f7ead3] p-0 shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#fff7eb]"
        />
      </Link>
    </>
  );

  return <Scroll_Page entityName={entityName} body={body} bodyClassName="absolute top-[12%] left-[10%] w-[80%] h-[80%] overflow-y-auto p-10" />;
}