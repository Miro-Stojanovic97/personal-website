// import React from "react";
'use client';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import D20FateRoll from "@/components/D20FateRoll";
import Scroll_Page from "@/components/ScrollPage";
import { DndContext } from "@/providers/DndProvider";

export default function Email() {
  async function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  const DndContextValue = useContext(DndContext);
  if (!DndContextValue) {
    throw new Error("DndContext must be used within a DndProvider");
  }
  const { setIsFireActive } = DndContextValue;
  const router = useRouter();
  const [ isDiceRollActive, setIsDiceRollActive ] = useState<boolean>(false);
  const [ selectedAction, setSelectedAction] = useState<string | null>(null);
  const [ selectedDifficultyCheck, setSelectedDifficultyCheck] = useState<number | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [hasSmokeFailed, setHasSmokeFailed] = useState<boolean>(false);
  const [hasFireFailed, setHasFireFailed] = useState<boolean>(false);
  const [hasWaterFailed, setHasWaterFailed] = useState<boolean>(false);
  const [hasStopFailed, setHasStopFailed] = useState<boolean>(false);

  async function handleFailure() {
    setInfoMessage("Failure  :(");
    await delay(700);
    switch(selectedAction) {
      case "smoke-signal":
        setHasSmokeFailed(true);
        break;
      case "fire-signal":
        setHasFireFailed(true);
        break;
      case "pour-water":
        setHasWaterFailed(true);
        break;
      case "stop":
        setHasStopFailed(true);
        break;
    }
    setIsDiceRollActive(false);
  }

  async function handleSuccess() {
    setInfoMessage("Success!  :)");
    await delay(700);
    switch(selectedAction) {
      case "smoke-signal":
        setHasSmokeFailed(true);
        window.location.href = "mailto:stojanovic.miro97@gmail.com?subject=Sending%20A%20Smoke%20Signal%20From%20Your%20Island";
        break;
      case "fire-signal":
        setHasFireFailed(true);
        window.location.href = "mailto:stojanovic.miro97@gmail.com?subject=Sending%20A%20Fire%20Signal%20From%20Your%20Island";
        break;
      case "pour-water":
        setHasWaterFailed(false);
        setIsFireActive(false);
        router.push("/");
        break;
      case "stop":
        setHasStopFailed(false);
        router.push("/");
        break;
    }
    setIsDiceRollActive(false);
  }
  
  function handleResult(result: number | null) {
    if (result !== null && selectedDifficultyCheck !== null) {
      if (result >= selectedDifficultyCheck) {
        handleSuccess();
      } else {
        handleFailure();
      }
    } else {
      setInfoMessage(`${result !== null ? result : "No Result"}`);
    }



  }

  function handleClick(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, action?: string) {
    e.preventDefault();
    let localDifficultyCheck = 0;
    setIsDiceRollActive(true);
    if (action) {
      setSelectedAction(action);
      switch(action) {
        case "smoke-signal":
          setSelectedDifficultyCheck(7);
          localDifficultyCheck = 7;
          break;
        case "fire-signal":
          setSelectedDifficultyCheck(14);
          localDifficultyCheck = 14;
          break;
        case "pour-water":
          setSelectedDifficultyCheck(10);
          localDifficultyCheck = 10;
          break;
        case "stop":
          setSelectedDifficultyCheck(1);
          localDifficultyCheck = 1;
          break;
        default:
          setSelectedDifficultyCheck(null);
      }
    }
    setInfoMessage(`Click to roll the d20... Must roll a ${localDifficultyCheck} or above!`);
  }

  const entityName = "Fire";
  const body = (
    <>
      <h1 className="text-center text-xl font-bold">
        You approach the fire. Choose your action:
      </h1>
      <div className="mt-2 space-y-2 text-center">
        <a
          onClick={(e) => handleClick(e, "smoke-signal")}
          href="mailto:stojanovic.miro97@gmail.com?subject=Sending%20A%20Smoke%20Signal%20From%20Your%20Island"
          className={`${hasSmokeFailed ? "opacity-50 pointer-events-none" : ""} block rounded-4xl border border-black/25 bg-white/30 p-2 hover:bg-white/45`}
        >
          Create a smoke signal using nearby materials (Email Me)
          <div className="text-xs">Survival Check - DC 7</div>
        </a>

        <a
          onClick={(e) => handleClick(e, "fire-signal")}
          href="mailto:stojanovic.miro97@gmail.com?subject=Sending%20A%20Fire%20Signal%20From%20Your%20Island"
          className={`${hasFireFailed ? "opacity-50 pointer-events-none" : ""} block rounded-4xl border border-black/25 bg-white/30 p-2 hover:bg-white/45`}
        >
          Use magic to skyrocket the fire as a signal (Email Me)
          <div className="text-xs">Arcana Check - DC 14</div>
        </a>

        <Link
          onClick={(e) => handleClick(e, "pour-water")}
          href="/"
          className={`${hasWaterFailed ? "opacity-50 pointer-events-none" : ""} block rounded-4xl border border-black/25 bg-white/30 p-2 hover:bg-white/45`}
        >
          Pour Water on the Fire
          <div className="text-xs">Strength Check - DC 10</div>
        </Link>

        <Link
          onClick={(e) => handleClick(e, "stop")}
          href="/"
          className={`${hasStopFailed ? "opacity-50 pointer-events-none" : ""} block rounded-4xl border border-black/25 bg-white/30 p-2 hover:bg-white/45`}
        >
          Stop Investigating the Fire
          <div className="text-xs">Wisdom Check - DC 1</div>
        </Link>
      </div>

      {isDiceRollActive ? (
        <div className="w-full mt-2 justify-center items-center">
          <h2 className="text-center text-base font-bold">{infoMessage}</h2>
          <D20FateRoll selectedDifficultyCheck={selectedDifficultyCheck} handleResult={handleResult} />
        </div>
      ) : null}
    </>
  );

  return <Scroll_Page entityName={entityName} body={body} bodyClassName="absolute top-[12%] left-[10%] w-[80%] h-[80%] overflow-y-auto p-10" showStopLink={false} />;
}