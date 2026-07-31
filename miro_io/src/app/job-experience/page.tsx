// import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Job_Experience() {
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
        ^^^ Exit Work Tent ^^^
        </Link>

        <div className="absolute top-[20%] left-[10%] w-[80%] h-[80%] overflow-y-auto p-10 " style={{ fontSize: 'clamp(0.1rem, 2vw, 0.9rem)' }}>
          <h1>I am a full-stack software engineer with a strong background in web development
            and a passion for creating clean user experiences. I have experience working with
            various technologies, including React, Next.js, Node.js, and more. My professional
            journey has allowed me to contribute to multiple projects, enhancing my skills in
            both front-end and back-end development.
          </h1>
          <br/><h1>[Resume]</h1>
        </div>
      </div>
    </div>
  );
}