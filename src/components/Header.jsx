import React from 'react';

export const Header = () => {
  return (
    <header className="w-full">
      {/* Top Banner Area */}
      <div className="bg-[#e4e4e9] py-4 flex flex-col items-center justify-center border-b border-gray-300 shadow-sm">
        
        {/* Placeholder for Sri Lankan Emblem */}
        <div className="w-16 h-20 mb-3 flex items-center justify-center">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Emblem_of_Sri_Lanka.svg/1024px-Emblem_of_Sri_Lanka.svg.png" 
            alt="Sri Lanka Emblem" 
            className="h-full object-contain"
          />
        </div>

        {/* Multilingual Text */}
        <h1 className="text-[#592c68] font-bold text-sm md:text-base tracking-wide text-center px-4">
          தேர்தல் ஆணைக்குழு / මැතිවරණ කොමිෂන් සභාව / Election Commission
        </h1>
      </div>

      {/* Tricolor Line */}
      <div className="w-full flex h-1.5">
        <div className="flex-1 bg-[#007f5f]"></div> {/* Green */}
        <div className="flex-1 bg-[#ffb703]"></div> {/* Yellow */}
        <div className="flex-1 bg-[#780000]"></div> {/* Maroon/Red */}
      </div>
    </header>
  );
};
