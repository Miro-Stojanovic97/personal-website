// import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Chess() {
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
        ^^^ Stop Investigating Chess Board ^^^
        </Link>

        <div className="absolute top-[20%] left-[10%] w-[80%] h-[80%] overflow-y-auto p-10 " style={{ fontSize: 'clamp(0.1rem, 2vw, 0.9rem)' }}>
          <h1>I am an avid gamer, on the board or on the screen. Growing up I was a huge fan of chess,
            and even started a chess club at my high school.
            My favorite other board games are Risk, Ticket to Ride, Catan, Codenames, and Sorry.</h1><br/><h1>
            In recent years, I have finished Red Dead Redemption 2, GTA5,
            Cyberpunk 2077, and am currently playing Baldurs Gate 3. I can't wait to play GTA6!
            I'm also an avid NBA 2K player, which you may have already discovered by exploring the camp.
          </h1>
          <br/><h1>[Photo of Me Playing Chess?]</h1>
        </div>
      </div>
    </div>
  );
}