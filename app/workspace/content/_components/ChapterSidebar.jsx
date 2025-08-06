"use client"; // Good practice to keep this as it interacts with user state via props

import React from 'react';
import { BookText, CheckCircle, Lock } from 'lucide-react'; // Import the new Lock icon
import clsx from 'clsx';

// --- THE PROP LIST IS UPDATED ---
// The component now receives 'enrollment' data
const ChapterSidebar = ({ chapters, activeChapterIndex, onChapterSelect, enrollment }) => {
  
  // Safely get the list of passed chapter titles, defaulting to an empty array
  const passedChapters = enrollment?.passedChapters || [];

  return (
    <aside className="w-80 h-screen bg-white border-r border-gray-200 p-6 flex flex-col">
      <h2 className="text-2xl font-bold mb-6">Course Chapters</h2>
      <nav className="flex-1 space-y-2 overflow-y-auto">
        {chapters.map((chapter, index) => {

          // --- NEW LOGIC TO DETERMINE CHAPTER STATE ---
          const isPassed = passedChapters.includes(chapter.title);
          
          // A chapter is locked if it's not the first one AND the previous chapter has not been passed.
          const isLocked = index > 0 && !passedChapters.includes(chapters[index - 1]?.title);
          
          return (
            <button
              key={index}
              onClick={() => onChapterSelect(index)}
              disabled={isLocked} // Disable the button if the chapter is locked
              className={clsx(
                "w-full flex items-start text-left p-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300",
                {
                  // Style for the currently active chapter
                  "bg-indigo-100 text-indigo-700 font-semibold": activeChapterIndex === index,
                  // Style for a clickable, non-active chapter
                  "text-gray-600 hover:bg-gray-100": activeChapterIndex !== index && !isLocked,
                  // Style for a locked chapter
                  "text-gray-400 bg-gray-50 cursor-not-allowed": isLocked,
                }
              )}
            >
              <div className="flex-shrink-0 mr-3 mt-1">
                {/* --- NEW ICON LOGIC --- */}
                {/* Display a specific icon based on the chapter's state */}
                {isPassed ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : isLocked ? (
                  <Lock className="w-5 h-5 text-gray-400" />
                ) : (
                  // Default icon for unlocked but not yet passed chapters
                  <BookText className="w-5 h-5 text-gray-500" />
                )}
              </div>
              <div>
                <span className="block text-sm">Chapter {index + 1}</span>
                <span className="block">{chapter.title}</span>
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default ChapterSidebar;