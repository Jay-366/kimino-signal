"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { SakuraParticles } from "../components/SakuraParticles";

const CHARACTERS = [
  { id: 1, name: "Ayano", description: "Web3 Pioneer", image: "/ayano_smile.png" },
  { id: 2, name: "LeBron", description: "The King of Legacy", image: "/lebron_happy.png" },
  { id: 4, name: "Mia", description: "Community Contributor", image: "/mia.png" },
  { id: 5, name: "GigaChad", description: "Peak Performance", image: "/gigachad.jpeg" },
  { id: 6, name: "67 Dude", description: "Mystery Legend", image: "/67dude.jpeg" },
  { id: 7, name: "Mickey Mouse", description: "The Icon", image: "/mickeymouse.jpeg" },
  { id: 8, name: "Elsa", description: "Ice Queen", image: "/elsa.png" },
  { id: 9, name: "Bocchi", description: "The Rock", image: "/bocchi.jpeg" },
];

export default function CommunityPage() {
  const router = useRouter();

  return (
    <div className="relative w-full min-h-screen bg-black overflow-x-hidden">
      {/* Background with overlay */}
      <div className="fixed inset-0 bg-[url('https://wallpapercave.com/wp/wp3738698.jpg')] bg-cover bg-center opacity-30 z-0" />
      
      <SakuraParticles />

      {/* Content */}
      <div className="relative z-10 p-8 md:p-16 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl md:text-7xl text-white font-black italic tracking-tighter drop-shadow-2xl">
              COMMUNITY <span className="text-pink-500">WORKSHOP</span>
            </h1>
            <p className="text-pink-200/60 font-bold tracking-[0.3em] uppercase mt-2">Discover & Customize Characters</p>
          </div>
          
          <button
            onClick={() => router.push("/")}
            className="px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-bold hover:bg-white/20 transition-all pointer-events-auto"
          >
            BACK TO TITLE
          </button>
        </div>

        {/* Character Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {CHARACTERS.map((char) => (
            <div 
              key={char.id}
              className="glass-panel group relative overflow-hidden rounded-[2.5rem] p-6 transition-all hover:scale-[1.02] hover:border-pink-500/50 cursor-pointer"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-rose-400 opacity-0 group-hover:opacity-20 transition-opacity blur-xl" />
              
              <div className="relative aspect-[3/4] overflow-hidden rounded-[1.5rem] bg-black/40 border border-white/10 mb-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={char.image} 
                  alt={char.name}
                  className="w-full h-full object-contain animate-breathe p-4"
                />
              </div>

              <div className="relative">
                <h3 className="text-3xl text-white font-black tracking-tight">{char.name}</h3>
                <p className="text-pink-300 font-bold text-sm tracking-widest uppercase mt-1">{char.description}</p>
                
                <div className="mt-6 flex gap-3">
                  <button className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-bold text-sm transition-all">
                    VIEW DATA
                  </button>
                  <button className="flex-1 py-3 bg-pink-500 hover:bg-pink-600 rounded-xl text-white font-bold text-sm transition-all shadow-[0_4px_15px_rgba(236,72,153,0.3)]">
                    SELECT
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Placeholder */}
          <div className="border-4 border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center p-8 opacity-40 hover:opacity-100 hover:border-pink-500/50 transition-all cursor-pointer min-h-[400px]">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4 text-white text-4xl font-light">+</div>
            <p className="text-white font-bold tracking-widest uppercase">New Submission</p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        body {
          overflow-y: auto !important;
          overflow-x: hidden;
        }
        ::-webkit-scrollbar {
          width: 10px;
        }
        ::-webkit-scrollbar-track {
          background: #000;
        }
        ::-webkit-scrollbar-thumb {
          background: #ec4899;
          border-radius: 5px;
          border: 2px solid #000;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #db2777;
        }
      `}</style>
    </div>
  );
}
