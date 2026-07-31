// import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Email() {
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
        ^^^ Stop Investigating Fire ^^^
        </Link>

        <div className="absolute top-[20%] left-[10%] w-[80%] h-[80%] overflow-y-auto p-10 " style={{ fontSize: 'clamp(0.1rem, 2vw, 0.9rem)' }}>
          <h1>
            [Toss a flare into the fire to send a signal (Email), and you'll get a response asap.]
          </h1><br/>


          <h1>
            [Pic of my LinkedIn and GitHub profiles]
          </h1>
      </div>
    </div>
    </div>
  );
}