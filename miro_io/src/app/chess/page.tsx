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

        <div className="absolute top-[11%] left-[10%] w-[80%] h-[80%] overflow-y-auto p-10 " style={{ fontSize: 'clamp(0.1rem, 2vw, 0.9rem)' }}>
          <h1>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;I'm a gamer, on board and on screen.
            Growing up, I was a big chess fan, even starting a chess club at my high school.
            Feel free to practice here, and challenge me at my Chess.com profile below:).
            My other favorite board games are Risk, Ticket to Ride, and Catan.
            In terms of video games, some favorites include Red Dead Redemption 2, 
            Cyberpunk, NBA2K, CS:GO, and I'm currently enjoying Baldur's Gate 3.</h1>
            <Link href="https://www.chess.com/member/miro12" target="_blank" rel="noopener noreferrer">
              <Image
                src="/chessprofile.png"
                alt="Chess.com profile"
                width={140}
                height={60}
                className="my-2 transition-all hover:-translate-y-1 mx-auto"
              />
            </Link>
            <Chess_Game />
        </div>
      </div>
    </div>
  );
}