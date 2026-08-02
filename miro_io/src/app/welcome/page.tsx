// import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Welcome() {
  return (
<div className="relative bg-[#FBDDB5] h-screen w-screen overflow-hidden">
      <div
        className="absolute top-1/2 left-1/2"
        style={{
          width: `min(100vw, 900px)`,
          height: '100vh',
          transform: "translate(-50%, -50%)",
        }}
      >

        <Image
          src="/scroll.png"
          alt="Hand-drawn home scene with clickable sections"
          fill
          priority
          className=""
        />

        <Link
        className="absolute top-[6%] right-[10%] p-1 bg-transparent rounded-lg text-black hover:bg-black/20 transition-colors"
        href="/"
        aria-label="Return Home"
        >
        ^^^ Stop Investigating Shoreline ^^^
        </Link>

        <div className="absolute top-[20%] left-[10%] w-[80%] h-[80%] overflow-y-auto p-10">
          <h1>Welcome to my website! My name is Miro.<br/>
            I'm a software engineer based in Milwaukee, Wisconsin.
          </h1><br/>

          <h1>
            You are visitor #: [insert visitor count here]
          </h1><br/>
          
          <h1>
            If you'd like to contact me directly from here, keep exploring the Island for ways to reach me:)
          </h1><br/>

          <h1>If you'd prefer a modern layout instead of this island adventure,
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
      </div>
    </div>
    </div>
  );
}