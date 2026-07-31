// import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Basketball() {
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
        ^^^ Stop Investigating Basketball Court ^^^
        </Link>

        <div className="absolute top-[20%] left-[10%] w-[80%] h-[80%] overflow-y-auto p-10" style={{ fontSize: 'clamp(0.1rem, 2vw, 0.9rem)' }}>
          <h1>My favorite sport to play and watch is Basketball. I play at least once per week,
            and I'm also a huge fan of the Milwaukee Bucks and NBA.
            You can also find me playing NBA 2K, which you may have already discovered by exploring the camp.
          </h1>
          <br/><h1>[Photo of Me Watching Bucks game]</h1>
        </div>
      </div>
    </div>
  );
}