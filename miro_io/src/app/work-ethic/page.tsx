// import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Work_Ethic() {
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
        prefetch={true}
        aria-label="Return Home"
        >
        ^^^ Stop Investigating Lumber Pile ^^^
        </Link>

        <div className="absolute top-[20%] left-[10%] w-[80%] h-[80%] overflow-y-auto p-10" style={{ fontSize: 'clamp(0.1rem, 2vw, 0.9rem)' }}>
          <h1>
            Growing up, my grandfather used to always talk about his experience as a lumber jack
            in his home village in Europe. It was hard work, and he took great pride in that fact.
            That is something I think rubbed off on me. From an early age, I have always had a
            full plate of activities, and tried to be a jack of all trades.
          </h1><br/>
          
          <h1>
            I started my academic career studying Mechanical Engineering at MSOE, and while there,
            I was a two-sport collegiate athlete, which put my work ethic to the test. The sport of
            Wrestling especially demanded more from me than I knew was possible. Afterwards, I obtained
            an MBA in Business Analytics from UW-Milwaukee, and made a career shift into Software Engineering
            via a bootcamp-to-hire program called Dev10. 
          </h1><br/>

          <h1>
            Today, I continue to keep a full plate. In addition to my work as a Software Engineer, 
            I enjoy learning new things (currently am reading Clean Code for the first time!), 3D printing
            with my Bambu P1S, training and competing in Brazilian Jiu Jitsu, and I also coach Track and Field
            in the Spring, which you may have learned about me by exploring the camp.
          </h1><br/>

          <h1>
            [Pic of me training or wrestling]
          </h1>
      </div>
    </div>
    </div>
  );
}