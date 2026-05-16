"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "./components/Navigation";
import { TitleCard } from "./components/TitleCard";
import { SetupModal } from "./components/SetupModal";
import { SakuraParticles } from "./components/SakuraParticles";
import { CharacterModal } from "./components/CharacterModal";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function TitleScreen() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [showCharModal, setShowCharModal] = useState(false);
  const [characterUrl, setCharacterUrl] = useState("/partner.png");

  const navItems = [
    { id: "game", title: "Start", subtitle: "START", onClick: () => setShowModal(true) },
    { id: "characters", title: "Partner", subtitle: "PARTNER", onClick: () => setShowCharModal(true) },
    { id: "music", title: "Workshop", subtitle: "WORKSHOP", onClick: () => router.push("/community") },
    { id: "settings", title: "Settings", subtitle: "CONFIG", onClick: () => console.log("settings") },
    { id: "credits", title: "Community & Author", subtitle: "COMMUNITY", onClick: () => console.log("credits") },
  ];

  return (
    <div className="relative w-full h-screen flex overflow-hidden">
      {/* Wallet Connect Button - Top Right */}
      <div className="absolute top-6 right-6 z-50 pointer-events-auto">
        <ConnectButton />
      </div>

      {/* Background */}
      <div className="absolute inset-0 bg-[url('https://wallpapercave.com/wp/wp3738698.jpg')] bg-cover bg-center z-0"></div>

      {/* Sakura Particles */}
      <SakuraParticles />

      {/* Center Area - Character Sprite */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[600px] md:w-[500px] md:h-[750px] pointer-events-none z-20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={characterUrl}
          alt="Partner"
          className="w-full h-full object-contain animate-breathe drop-shadow-[0_0_25px_rgba(255,183,178,0.4)]"
        />
      </div>

      {/* Left Area - Title & Navigation */}
      <div className="relative z-30 flex flex-col items-start pl-8 md:pl-16 pt-8 md:pt-12 h-full overflow-y-auto no-scrollbar pb-12 w-full max-w-3xl pointer-events-none">

        {/* Title Section (On Top) */}
        <div className="z-40 mb-8 shrink-0 pointer-events-auto">
          <TitleCard />
        </div>

        {/* Navigation Section */}
        <div className="relative w-[400px] shrink-0 flex-1 flex flex-col pointer-events-auto">
          <Navigation items={navItems} />
        </div>
      </div>

      {/* Start Modal */}
      <SetupModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        onStart={(data) => {
          console.log("Setup Data:", data);
          router.push(`/scene1?charUrl=${encodeURIComponent(characterUrl)}`);
        }} 
      />

      <CharacterModal
        isOpen={showCharModal}
        onClose={() => setShowCharModal(false)}
        currentCharacterUrl={characterUrl}
        onSelect={(url) => setCharacterUrl(url)}
      />
    </div>
  );
}
