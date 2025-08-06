"use client"; // Keep this, as useEffect is used for fetching videos

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Loader2, Youtube } from 'lucide-react';
import ActionButtons from './ActionButtons'; // We still need this for the buttons

// --- THE PROP LIST IS NOW CLEANER ---
// This component no longer needs 'onContentGenerated'
const ContentDisplay = ({ chapter, courseId, courseName, chapterIndex, totalChapters, hasPassedQuiz, onUpdate }) => {
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  // This effect to fetch the YouTube video is perfect, no changes needed.
  useEffect(() => {
    const fetchVideo = async () => {
      if (chapter) {
        setIsLoadingVideo(true);
        setVideoUrl('');
        try {
          const searchQuery = `${courseName} ${chapter.title} tutorial`;
          const response = await axios.get(`/api/get-youtube-videos?q=${searchQuery}`);
          if (response.data && response.data.length > 0) {
            const videoId = response.data[0].videoId;
            setVideoUrl(`https://www.youtube.com/embed/${videoId}`);
          }
        } catch (error) {
          console.error("Failed to fetch YouTube video:", error);
        } finally {
          setIsLoadingVideo(false);
        }
      }
    };

    fetchVideo();
  }, [chapter, courseName]);

  if (!chapter) {
    return <div className="text-center p-10">Select a chapter to begin.</div>;
  }
  
  // --- UNNECESSARY PART REMOVED ---
  // The 'handleGenerateContent' function and 'isLoadingContent' state have been completely removed.
  // All that logic now lives correctly inside the 'ActionButtons' component.

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{chapter.title}</h1>
      
      {/* YouTube Video Section - This is correct */}
      <div className="aspect-video bg-gray-800 rounded-lg mb-8 flex items-center justify-center text-gray-500 overflow-hidden">
        {isLoadingVideo ? (
            <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin mx-auto mb-2" />
                <p>Finding a relevant video...</p>
            </div>
        ) : videoUrl ? (
            <iframe
              width="100%"
              height="100%"
              src={videoUrl}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
        ) : (
            <div className="text-center">
                <Youtube className="w-16 h-16 mx-auto mb-2" />
                <p>No relevant video found.</p>
            </div>
        )}
      </div>
      
      {/* Chapter Content Section - This is correct */}
      <div className="bg-white p-6 rounded-lg shadow-md min-h-[300px]">
        <h2 className="text-2xl font-semibold mb-4">Chapter Content</h2>
        {chapter.content ? (
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown>{chapter.content}</ReactMarkdown>
          </div>
        ) : (
          // --- UNNECESSARY PART REMOVED ---
          // The old "Generate with AI" button is gone. We just show a simple message.
          <div className="text-center flex flex-col items-center justify-center h-full">
            <p className="text-gray-500">No content has been generated for this chapter yet.</p>
            <p className="text-gray-400 text-sm mt-2">Click the button below to generate it with AI.</p>
          </div>
        )}
      </div>

      {/* The Action Buttons component is now the single source for all actions */}
      <div className="mt-8 flex justify-end">
        <ActionButtons 
            chapter={chapter}
            courseId={courseId}
            chapterIndex={chapterIndex}
            totalChapters={totalChapters}
            hasPassedQuiz={hasPassedQuiz}
            onUpdate={onUpdate}
        />
      </div>
    </div>
  );
};

export default ContentDisplay;