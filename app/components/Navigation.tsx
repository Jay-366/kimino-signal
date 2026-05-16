interface NavItem {
  id: string;
  title: string;
  subtitle: string;
  onClick: () => void;
}

interface NavigationProps {
  items: NavItem[];
}

export const Navigation = ({ items }: NavigationProps) => {
  return (
    <>
      {/* Sidebar Container - Menu Only */}
      <div 
        className="relative w-full bg-[#fdfaf6] rounded-r-3xl shadow-2xl overflow-hidden flex flex-col border-r-4 border-pink-200/30 flex-1"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(244, 114, 182, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(244, 114, 182, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      >
        {/* Spiral Bound Edge */}
        <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col items-center py-6 gap-4 z-10 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div 
              key={i} 
              className="w-4 h-4 rounded-full bg-white shadow-inner border border-gray-100 flex items-center justify-center"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-pink-100/30" />
            </div>
          ))}
          {/* Vertical binder line */}
          <div className="absolute right-0 top-0 bottom-0 w-px bg-pink-200/40" />
        </div>

        {/* Main Scrollable Content Area */}
        <div 
          className="relative z-20 flex flex-col gap-1 flex-1 overflow-y-auto overscroll-y-contain no-scrollbar pl-12 pr-4 pb-6 pt-4"
        >
          {items.map((item, index) => (
            <div key={item.id} className="w-full flex flex-col items-start group">
              {/* Button Component */}
              <button 
                onClick={item.onClick}
                className="
                  relative text-left flex items-center transition-all duration-300 ease-out
                  w-[96%] py-4 px-4 hover:translate-x-3
                "
              >
                {/* Sakura Icon Container */}
                <div 
                  className="
                    flex items-center justify-center shrink-0 origin-center rotate-0 opacity-80 
                    group-hover:opacity-100 group-hover:rotate-[48deg] 
                    transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.34,1.45,0.64,1)] 
                    w-8 h-8 mr-3
                  "
                  aria-hidden="true"
                >
                  <svg
                    className="w-full h-full text-pink-400 drop-shadow-md"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                </div>

                {/* Labels Container */}
                <div className="flex flex-row items-baseline gap-2">
                  <span 
                    className="
                      font-sans font-extrabold leading-tight tracking-[0.05em] text-slate-700 
                      group-hover:text-pink-600 transition-colors drop-shadow-sm
                      text-[22px]
                    "
                  >
                    {item.title}
                  </span>
                  <span 
                    className="
                      leading-none font-bold tracking-[0.15em] uppercase text-pink-400/80 
                      group-hover:text-pink-500 transition-colors
                      text-[13px]
                    "
                  >
                    {item.subtitle}
                  </span>
                </div>
              </button>

              {/* Dashed Separator */}
              {index < items.length - 1 && (
                <div 
                  className="h-px border-b-[1.5px] border-dashed border-pink-300/60 w-[80%] ml-12 my-1" 
                />
              )}
            </div>
          ))}
        </div>

        {/* Paper texture overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cardboard-flat.png")' }} />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </>
  );
};
