import Image from "next/image";
import React from "react";
import Wave from 'react-wavify';

export default function Home() {
  return (
    <div className="grid grid-cols-5 grid-rows-1 min-h-screen">
        <main className="col-start-2 col-span-3 bg-[url(/backdropv2.svg)] bg-center bg-contain bg-no-repeat grid grid-cols-5 grid-rows-5">
          <div className="col-start-2 row-start-2">
            <a
              className="rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
              href=""
              target="_blank"
              rel="noopener noreferrer"
            >
              About Me
            </a>
          </div>
          <div className="col-start-4 row-start-2">
            <a
              className="rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
              href=""
              target="_blank"
              rel="noopener noreferrer"
            >
              Experience
            </a>
          </div>
          <div className="col-start-2 row-start-4">
            <a
              className="rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
              href=""
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact Me
            </a>
          </div>
          <div className="col-start-4 row-start-4 order-last px-5"> 
            <Image
              src="/boat.svg"
              alt="boat"
              width={60}
              height={60}
              className=""
            />
          </div>
          <div className="col-start-1 row-start-4 col-span-5 justify-items-center">
            <Wave fill="url(#gradient)"
                  paused={false}
                  style={{ display: 'flex-1', width: '81.5%', justifyContent: 'center', alignItems: 'center', marginLeft: '-0.5%' }}
                  options={{
                    height: 26,
                    amplitude: 25,
                    speed: 0.2,
                    points: 0.5
                  }}
            >
              <defs>
                <linearGradient id="gradient" gradientTransform="rotate(90)">
                  <stop offset="10%"  stopColor="#c5e5ff" />
                  <stop offset="90%" stopColor="#4dabf7" />
                </linearGradient>
              </defs>
            </Wave>
          </div>
          <div className="col-start-2 row-start-5 col-span-3">
            <p className="text-3xl text-white text-center font-calibri">
              hi, i'm miro :) explore to learn more about me!
            </p>
          </div>
          <div className="col-start-2 row-start-5 col-span-3 py-15">
            <p className="text-white text-center font-italic">
              [Website is not done. TODOs: Responsive design. Button design & on-click content modals.]
            </p>
          </div>
        </main>
    </div>
  );
}
