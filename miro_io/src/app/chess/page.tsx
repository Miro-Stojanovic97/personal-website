// import React from "react";
import Chess_Game from "@/components/ChessGame";
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
        >
        ^^^ Stop Investigating Chess Board ^^^
        </Link>

        <div className="absolute top-[12%] left-[10%] w-[80%] h-[80%] overflow-y-auto p-10 " style={{ fontSize: 'clamp(0.1rem, 2vw, 0.9rem)' }}>
          <h1>I am an avid gamer, on the board or on the screen. Growing up I was a huge fan of chess,
            and even started a chess club at my high school. Feel free to navigate to my Chess.com
            profile below.</h1>
            <Link href="https://www.chess.com/member/miro12" target="_blank" rel="noopener noreferrer">
              <Image
                src="/chessprofile.png"
                alt="Chess.com profile"
                width={140}
                height={60}
                className="transition-all hover:-translate-y-1 mx-auto"
              />
            </Link>
            <h1>
            My favorite other board games are Risk, Ticket to Ride, Catan, Codenames, and Sorry.</h1><br/><h1>
            In recent years, I have finished Red Dead Redemption 2, GTA5 (eagerly awaiting GTA6!),
            Cyberpunk 2077, and am currently playing Baldurs Gate 3. I'm also an avid NBA 2K player,
            which you may have already discovered by exploring the camp.
          </h1>
          
        <Chess_Game />

        </div>
      </div>
    </div>
  );
}