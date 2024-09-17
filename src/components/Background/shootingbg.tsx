"use client";
import React from "react";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";

//import MainPageCards from "@/components/cards/mainPageCards";
//import { Main } from "next/document";
import HomePage from "../cards/mainPageCards";
export function ShootingStarsAndStarsBackgroundDemo() {
  return (
    <div className="h-[100vh] rounded-md bg-neutral-900 flex flex-col items-center justify-center relative w-full">
      <HomePage />
      <ShootingStars />
      <StarsBackground />
    </div>
  );
}
