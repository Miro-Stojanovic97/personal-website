// import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Throws() {
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
        ^^^ Stop Investigating Throwing Circle ^^^
        </Link>

        <div className="absolute top-[12%] left-[10%] w-[80%] h-[80%] overflow-y-auto p-10 " style={{ fontSize: "clamp(0.8rem, min(2.8vw, 2vh), 1.1rem)" }}>
          <h1>In my free time during the Spring, I coach track & field throwing at a local high school.
            So far, 6 of my athletes have qualified for the state meet, and 1 has become a state medalist,
            pictured below at the State Championships. Most importantly to me, 3 of my athletes have gone
            on to compete athletically in college! :)
          </h1><br/>
        
          <Image
            src="/track-pic.jpg"
            alt="Photo of me coaching throws"
            width={300}
            height={200}
            className="mx-auto mt-[clamp(0.75rem,2vh,1.5rem)] h-auto rounded-full border-2 border-black"
            style={{ width: "clamp(120px, min(50vw, 30vh), 300px)", height: "auto" }}
          />

        </div>
      </div>
    </div>
  );
}