// import React from "react";
import Chess_Game from "@/components/ChessGame";
import Scroll_Page from "@/components/ScrollPage";
import Image from "next/image";
import Link from "next/link";

export default function Chess() {
  const entityName = "Chess Board";
  const body = (
    <>
      <h1>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;I&apos;m a gamer, on board and on screen.
        Growing up, I was a big chess fan, even starting a chess club at my high school.
        Feel free to practice here, and challenge me at my Chess.com profile below:).
        My other favorite board games are Risk, Ticket to Ride, and Catan.
        In terms of video games, some favorites include Red Dead Redemption 2,
        Cyberpunk, NBA2K, CS:GO, and I&apos;m currently enjoying Baldur&apos;s Gate 3.</h1>
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
    </>
  );

  return <Scroll_Page entityName={entityName} body={body} bodyClassName="absolute top-[12%] left-[10%] w-[80%] h-[80%] overflow-y-auto p-10" />;
}