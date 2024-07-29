"use client";

import React from "react";
import { TypewriterEffectSmooth } from "../ui/typewriter-effect";
import Link from "next/link"; // Import the Link component

export function TypewriterEffectSmoothDemo() {
  const words = [
    { text: "Make" },
    { text: "automated" },
    { text: "calls" },
    { text: "easy with" },
    { text: "Toingg", className: "text-blue-500 dark:text-blue-500" },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-[40rem] z-50">
      <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base">
        The road to seamless automated calls
      </p>
      <TypewriterEffectSmooth words={words} />
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
        <Link href="/main">
          <button
            className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm"
          >
            Get Started
          </button>
        </Link>
        <button className="w-40 h-10 rounded-xl bg-white text-black border border-black text-sm">
          Signup
        </button>
      </div>
    </div>
  );
}
