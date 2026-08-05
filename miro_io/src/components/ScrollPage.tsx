// import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Scroll_Page({ entityName, body, bodyClassName, showStopLink = true }: { entityName: string, body: React.ReactNode, bodyClassName?: string, showStopLink?: boolean }) {
  const contentClassName = bodyClassName || "absolute top-[12%] left-[10%] w-[80%] h-[80%] overflow-y-auto p-10";

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

        {showStopLink && (
          <Link
          className="absolute top-[6%] right-[10%] px-4 border border-black/10 rounded-lg text-black hover:bg-black/20 transition-colors"
          href="/"
          prefetch={true}
          aria-label="Return Home"
          >
          Stop Investigating {entityName}
          </Link>
        )}

        <div className={contentClassName} style={{ fontSize: 'clamp(0.1rem, 2vw, 0.9rem)' }}>
            { body }
      </div>
    </div>
    </div>
  );
}