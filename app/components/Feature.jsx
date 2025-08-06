"use client"; // This component now uses state, so it must be a Client Component

import React, { useState } from 'react';
import Image from 'next/image'; // Assuming you are using next/image

// A curated list of vibrant Tailwind CSS colors (as hex codes)
// We use hex codes here because they are easier to apply in an inline style.
const vibrantColors = [
  '#3b82f6', // blue-500
  '#6366f1', // indigo-500
  '#a855f7', // purple-500
  '#ec4899', // pink-500
  '#f43f5e', // rose-500
  '#f97316', // orange-500
  '#eab308', // amber-500
  '#84cc16', // lime-500
  '#22c55e', // green-500
  '#10b981', // emerald-500
  '#06b6d4', // cyan-500
];

const Feature = ({ val, index }) => {
  // 1. Add state to manage the background color.
  // The initial color is white.
  const [bgColor, setBgColor] = useState('#ffffff'); 

  // 2. A function to pick and set a new random color.
  const handleMouseEnter = () => {
    const randomColor = vibrantColors[Math.floor(Math.random() * vibrantColors.length)];
    setBgColor(randomColor);
  };

  // 3. A function to reset the color when the mouse leaves.
  const handleMouseLeave = () => {
    setBgColor('#ffffff'); // Reset to white
  };
  
  return (
    // 4. Attach the event handlers and apply the dynamic style.
    <div 
      className='w-full group py-20' 
      style={{ 
        backgroundColor: bgColor, 
        transition: 'background-color 0.4s ease-in-out' 
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className='max-w-screen-xl mx-auto flex items-center gap-10 justify-between'>
        <div className='w-1/3'>
          <h1 className='text-5xl capitalize font-sans font-medium' style={{ color: bgColor === '#ffffff' ? '#000000' : '#ffffff', transition: 'color 0.4s ease-in-out' }}>
            {val.title}
          </h1>
        </div>
        
        <div className='w-1/3'>
          <Image 
            src={val.image} 
            width={400} 
            height={400} 
            alt={val.title} // Always include alt text for accessibility
            className='group-hover:opacity-100 opacity-0 rounded-lg shadow-2xl transform transition-all duration-300 hover:scale-105'
          />
        </div>

        <div className='w-1/3'>
          <p className='mb-10 mx-3 text-lg' style={{ color: bgColor === '#ffffff' ? '#374151' : '#f0f0f0', transition: 'color 0.4s ease-in-out' }}>
            {val.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Feature;