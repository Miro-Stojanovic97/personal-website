// import React from "react";
import Link from "next/link";

export default function Welcome() {
  return (
<div className="relative bg-white h-screen w-screen overflow-hidden">
    <h1 className="text-center text-4xl font-bold mt-10">
        Welcome to the Modern Layout
    </h1>
    <h1 className="text-center text-2xl font-semibold mt-10">
        If you want to return to the island adventure:
    </h1>
    <Link
        className="border p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors mt-5 block mx-auto w-max"
        href="/"
        prefetch={true}>
        Click Here
    </Link><br/>
</div>
  );
}