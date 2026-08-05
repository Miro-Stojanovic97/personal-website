// import React from "react";
import Image from "next/image";
import Link from "next/link";
import D20FateRoll from "@/components/D20FateRoll";
import Scroll_Page from "@/components/ScrollPage";

export default function Email() {
  const entityName = "Fire";
  const body = (
    <>
      <h1 className="text-center text-xl font-bold">
        You approach the fire. Choose your action:
      </h1>
      <div className="mt-6 space-y-4 text-center">
        <a
          href="mailto:stojanovic.miro97@gmail.com?subject=Sending%20A%20Smoke%20Signal%20From%20Your%20Island"
          className="block rounded-md border border-black/25 bg-white/30 p-3 hover:bg-white/45"
        >
          1. Create a smoke signal using nearby materials (Email Me)
          <div className="text-xs mt-1">Survival Check - DC 7</div>
        </a>

        <a
          href="mailto:stojanovic.miro97@gmail.com?subject=Sending%20A%20Fire%20Signal%20From%20Your%20Island"
          className="block rounded-md border border-black/25 bg-white/30 p-3 hover:bg-white/45"
        >
          2. Use magic to skyrocket the fire as a signal (Email Me)
          <div className="text-xs mt-1">Arcana Check - DC 14</div>
        </a>

        <a
          href=""
          className="block rounded-md border border-black/25 bg-white/30 p-3 hover:bg-white/45"
        >
          3. Pour water on the fire
        </a>

        <Link
          href="/"
          className="block rounded-md border border-black/25 bg-white/30 p-3 hover:bg-white/45"
        >
          4. Turn back to camp
        </Link>
      </div>

      <div className="mt-10 flex justify-center items-center">
        <D20FateRoll />
      </div>
    </>
  );

  return <Scroll_Page entityName={entityName} body={body} bodyClassName="absolute top-[12%] left-[10%] w-[80%] h-[80%] overflow-y-auto p-10" showStopLink={false} />;
}