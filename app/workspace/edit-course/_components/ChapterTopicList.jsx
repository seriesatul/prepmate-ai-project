"use client";

import React from 'react';
import { CheckCircle } from 'lucide-react';

// --- Helper Arrays for Randomization ---
const colors = [
 'bg-rose-500',
  'bg-pink-500',
  'bg-fuchsia-500',
  'bg-red-500',
  'bg-rose-400',
  'bg-pink-600',

  // Oranges & Yellows - For creativity, warmth, and optimism
  'bg-orange-500',
  'bg-amber-500',
  'bg-yellow-400',
  'bg-orange-400',
  'bg-amber-400',

  // Greens & Limes - For growth, nature, and success
  'bg-lime-500',
  'bg-green-500',
  'bg-emerald-500',
  'bg-teal-500',
  'bg-lime-400',
  'bg-green-600',
  'bg-emerald-600',
  'bg-teal-400',

  // Blues & Cyans - For trust, technology, and calmness
  'bg-cyan-500',
  'bg-sky-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-cyan-400',
  'bg-sky-600',
  'bg-blue-600',
  'bg-indigo-600',

  // Purples & Violets - For luxury, ambition, and creativity
  'bg-violet-500',
  'bg-purple-500',
  'bg-violet-600',
  'bg-purple-600',
  'bg-fuchsia-600',
];
const sizes = [
  'w-92 h-40', 'w-92 h-44', 'w-92 h-48', 'w-92 h-52', 'w-92 h-56'
];

const CourseRoadmap = ({ course }) => {
  const chapters = course?.courseJson?.courseList || [];

  return (
    <div className="relative w-full max-w-5xl mx-auto p-4 sm:p-10 font-sans">
      
      {/* --- The Central Vertical Line --- */}
      <div className="absolute top-0 left-1/2 w-1 h-full bg-gray-200 -translate-x-1/2 z-0"></div>

      <div className="relative space-y-12">
        
        {chapters.map((chapter, index) => {
          // --- Generate Random Values for Each Chapter ---
          const randomColorClass = colors[Math.floor(Math.random() * colors.length)];
          const randomSizeClass = sizes[Math.floor(Math.random() * sizes.length)];
          const isLeft = index % 2 === 0;

          return (
            <div key={index} className="relative w-full">
              
              {/* --- The Container that pushes content left or right --- */}
              <div className={`w-full flex ${isLeft ? 'justify-start' : 'justify-end'}`}>
                
                {/* This is the content block that holds the square and description */}
                <div className={`w-1/2 px-4 sm:px-8 ${isLeft ? 'pr-8' : 'pl-8'}`}>
                  <div 
                    className={`
                      ${randomColorClass} 
                      ${randomSizeClass}
                      mx-auto sm:mx-0 ${isLeft ? 'ml-auto' : 'mr-auto'}
                      rounded-2xl 
                      shadow-xl 
                      flex
                      flex-col
                      justify-center
                      p-4 
                      text-white 
                      text-center 
                      text-2xl
                      transform 
                      transition-transform 
                      hover:scale-105
                      cursor-pointer
                    `}
                  >
                    <strong>Chapter{index + 1}:</strong>{chapter.title}
                  </div>
                </div>

              </div>

              {/* --- Description is positioned separately to create the zig-zag --- */}
              <div className={`w-full flex ${isLeft ? 'justify-end' : 'justify-start'} mt-2`}>
                 <div className={`w-1/2 px-4 sm:px-8 ${isLeft ? 'pl-8' : 'pr-8'}`}>
                     <p className={`text-sm text-gray-600 leading-relaxed ${isLeft ? 'text-left' : 'text-right'}`}>
                        {chapter.description}
                    </p>
                 </div>
              </div>


              {/* --- Connecting Dot on the Timeline --- */}
              <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 border-4 border-blue-500 z-10 flex items-center justify-center">
                <span className="text-blue-600 font-bold">{index + 1}</span>
              </div>
            </div>
          );
        })}

        {/* --- Final "Finish" Node at the end --- */}
        <div className="relative w-full flex justify-center mt-12">
             <div className="absolute left-1/2 w-10 h-10 bg-green-500 rounded-full -translate-x-1/2 border-4 border-white z-10 flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
        </div>

      </div>
    </div>
  );
};

export default CourseRoadmap;