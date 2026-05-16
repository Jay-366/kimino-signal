import React from 'react';

export const TitleCard = () => {
  return (
    <div className="relative z-40 animate-in fade-in zoom-in-95 duration-1000">
      <div className="relative bg-white px-12 py-10 shadow-2xl transform -rotate-1 hover:rotate-0 transition-transform duration-700"
           style={{
             clipPath: 'polygon(1% 2%, 98% 0%, 100% 12%, 99% 88%, 96% 100%, 4% 98%, 0% 85%, 2% 15%)',
             boxShadow: '0 20px 50px -12px rgba(0, 0, 0, 0.15)',
             backgroundImage: 'linear-gradient(rgba(255,255,255,0.92), rgba(255,255,255,0.92)), url("https://www.transparenttextures.com/patterns/notebook.png")'
           }}>
        
        {/* Decorative Grid Line behind the text */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-pink-100/50 -translate-y-4" />

        {/* Main Title Text: Kimi No Signal */}
        <div className="relative flex flex-col items-center justify-center">
           <h1 className="text-7xl font-bold text-[#63544d] drop-shadow-md flex items-center gap-1" 
               style={{ fontFamily: '"Gloria Hallelujah", cursive, sans-serif' }}>
             <span className="text-pink-500/90">Kimi</span>
             <span className="mx-1 text-orange-400 italic text-8xl transform -rotate-3 drop-shadow-sm">No</span>
             <span>Signal</span>
           </h1>
        </div>

        {/* Subtext and Decorative Elements */}
        <div className="mt-4 flex items-center justify-center relative min-w-[400px]">
          {/* Left Heart Trail - Styled like the sketch */}
          <div className="absolute -left-6 top-0 flex items-center">
             <svg width="80" height="30" viewBox="0 0 80 30" fill="none" className="text-pink-400 opacity-80">
               <path d="M5 15C15 5 25 25 40 15C50 10 60 20 75 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="5 3"/>
               {/* Small Heart Shape */}
               <path d="M12 15C12 13 15 13 15 15C15 17 12 19 12 15Z" fill="currentColor"/>
             </svg>
          </div>

          {/* The Japanese Subtitle */}
          <p className="text-xl font-medium text-[#7c6d66] tracking-[0.2em] px-10 whitespace-nowrap" 
             style={{ fontFamily: '"Noto Sans SC", sans-serif' }}>
            恋爱 &amp; 紙で飛んだ青春物語
          </p>

          {/* Right Paper Airplane */}
          <div className="absolute -right-8 bottom-0 animate-bounce-subtle">
             <svg width="45" height="45" viewBox="0 0 24 24" fill="none" className="text-pink-300 transform -rotate-12 drop-shadow-sm">
               <path d="M3 10L21 3L18 21L12 16L9 21L8 14L3 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
               <path d="M21 3L8 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
             </svg>
          </div>
        </div>
        
        {/* Subtle bottom accent line */}
        <div className="absolute bottom-6 left-12 right-12 h-[2px] bg-gradient-to-r from-transparent via-pink-200/40 to-transparent" />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Gloria+Hallelujah&family=Noto+Sans+SC:wght@400;700&display=swap');
        
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0) rotate(-12deg); }
          50% { transform: translateY(-5px) rotate(-10deg); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
      `}} />
    </div>
  );
};
