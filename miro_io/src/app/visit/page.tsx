// import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Visit() {
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
        prefetch={true}
        >
        ^^^ Stop Investigating Kayak ^^^
        </Link>

        <div className="absolute top-[20%] left-[10%] w-[80%] h-[80%] overflow-y-auto p-10">
          <h1>
            https://www.linkedin.com/in/mirostojanovic/
          </h1><br/>
          <h1>
            https://github.com/Miro-Stojanovic97
          </h1><br/>
          <h1>
            [Enter the Kayak and adventure to other parts of the Internet Sea, like the Islands of LinkedIn and GitHub]
          </h1><br/>



          <h1>
            [Pic of me]
          </h1>
      </div>
    </div>
    </div>
  );
}