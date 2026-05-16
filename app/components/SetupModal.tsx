import React, { useState, useRef } from "react";
import { BACKGROUND_URLS } from "@/lib/story-config";

export interface SetupData {
  storyPdf: File | null;
  backgroundId: string;
}

interface SetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: (data: SetupData) => void;
}

const BACKGROUNDS = [
  { id: "bg1", name: "Classroom", preview: BACKGROUND_URLS.classroom },
  { id: "bg2", name: "Arena", preview: BACKGROUND_URLS.arena },
  { id: "bg3", name: "Random", preview: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200" },
];

export const SetupModal = ({ isOpen, onClose, onStart }: SetupModalProps) => {
  const [storyPdf, setStoryPdf] = useState<File | null>(null);
  const [backgroundId, setBackgroundId] = useState<string>("bg1");

  const pdfInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleStart = () => {
    onStart({ storyPdf, backgroundId });
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md animate-in fade-in duration-300 pointer-events-auto p-4">
      <div 
        className="bg-[#fdfaf6] rounded-[2rem] p-6 md:p-8 max-w-2xl w-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-pink-200/50 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col gap-6"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(244, 114, 182, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(244, 114, 182, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      >
        <div className="text-center mb-2">
          <h2 className="text-3xl font-extrabold text-slate-700 mb-2 tracking-wide" style={{ fontFamily: '"Nunito", sans-serif' }}>Story Setup</h2>
          <p className="text-slate-500 font-medium">Prepare your characters and scenes</p>
        </div>

        <div className="flex flex-col gap-6">
          {/* PDF Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">1. Story Script (PDF)</label>
            <div 
              onClick={() => pdfInputRef.current?.click()}
              className="border-2 border-dashed border-blue-300 hover:border-blue-500 hover:bg-blue-50/50 transition-colors rounded-2xl p-6 text-center cursor-pointer flex flex-col items-center justify-center min-h-[120px]"
            >
              <input 
                type="file" 
                ref={pdfInputRef} 
                accept=".pdf" 
                className="hidden" 
                onChange={(e) => setStoryPdf(e.target.files?.[0] || null)}
              />
              {storyPdf ? (
                <div className="text-blue-600 font-medium">Selected: {storyPdf.name}</div>
              ) : (
                <div className="text-slate-500">
                  <span className="text-blue-500 font-semibold">Click to upload</span> or drag and drop PDF file
                </div>
              )}
            </div>
          </div>

          {/* Background Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">2. Starting Scene Background</label>
            <div className="grid grid-cols-3 gap-4">
              {BACKGROUNDS.map((bg) => (
                <div 
                  key={bg.id}
                  onClick={() => setBackgroundId(bg.id)}
                  className={`
                    relative rounded-xl overflow-hidden cursor-pointer border-4 transition-all
                    ${backgroundId === bg.id ? 'border-pink-500 scale-105 shadow-lg' : 'border-transparent hover:scale-105 hover:shadow'}
                  `}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={bg.preview} alt={bg.name} className="w-full h-24 object-cover" />
                  <div className="absolute bottom-0 w-full bg-black/50 backdrop-blur-sm text-white text-xs p-1 text-center font-medium">
                    {bg.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <button 
            onClick={onClose} 
            className="flex-1 py-3 px-6 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-600 rounded-2xl font-bold text-lg transition-all hover:scale-105"
          >
            Cancel
          </button>
          <button 
            onClick={handleStart} 
            className="flex-1 py-3 px-6 bg-pink-400 hover:bg-pink-500 text-white shadow-[0_0_15px_rgba(244,114,182,0.4)] rounded-2xl font-bold text-lg transition-all hover:scale-105"
          >
            Start Story
          </button>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(244, 114, 182, 0.3); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(244, 114, 182, 0.5); }
      `}} />
    </div>
  );
};
