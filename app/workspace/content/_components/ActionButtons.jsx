"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Zap, Loader2, ShieldCheck, ArrowRight, CheckCircle } from 'lucide-react';

const ActionButtons = ({ chapter, courseId, chapterIndex, totalChapters, hasPassedQuiz, onUpdate }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState('');

  // --- THIS IS THE FIX ---
  // Add a "guard clause" at the top.
  // If the chapter data hasn't loaded yet, don't render any buttons.
  if (!chapter) {
    return null;
  }
  // --- END OF FIX ---

  const handleGenerateContent = async () => {
    setLoadingAction('content');
    setIsLoading(true);
    try {
      await axios.post('/api/generate-course-content', { courseId, chapterTitle: chapter.title });
      onUpdate();
    } catch (error) { 
      console.error("Content generation failed:", error); 
      alert("Failed to generate content. Please try again.");
    }
    setIsLoading(false);
    setLoadingAction('');
  };

  const handleGenerateQuiz = async () => {
    setLoadingAction('quiz');
    setIsLoading(true);
    try {
      // It's crucial that chapter.content exists for this call
      if (!chapter.content) {
        alert("Please generate the chapter content first.");
        setIsLoading(false);
        setLoadingAction('');
        return;
      }
      await axios.post('/api/generate-quiz', {
        courseId,
        chapterTitle: chapter.title,
        chapterContent: chapter.content,
      });
      onUpdate();
    } catch (error) { 
      console.error("Quiz generation failed:", error); 
      alert("Failed to generate the quiz. Please try again.");
    }
    setIsLoading(false);
    setLoadingAction('');
  };

  const navigateToQuiz = () => {
    router.push(`/workspace/quiz/${courseId}/${chapterIndex}`);
  };

  const navigateToNextChapter = () => {
    onUpdate(chapterIndex + 1); 
  };
  
  // --- Your conditional rendering logic is already correct ---
  if (isLoading) {
    return (
      <button disabled className="flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-zinc-300 rounded-md cursor-not-allowed">
        <Loader2 className="w-5 h-5 animate-spin" />
        {loadingAction === 'content' ? 'Generating Content...' : 'Generating Quiz...'}
      </button>
    );
  }

  if (!chapter.content) {
    return <button onClick={handleGenerateContent} className="flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-zinc-600 rounded-md hover:bg-zinc-700 transition-colors"><Zap /> Generate Content</button>;
  }

  if (chapter.content && !chapter.quiz) {
    return <button onClick={handleGenerateQuiz} className="flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"><ShieldCheck /> Generate Quiz</button>;
  }

  if (chapter.quiz && !hasPassedQuiz) {
    return <button onClick={navigateToQuiz} className="flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"><ShieldCheck /> Take Quiz to Unlock</button>;
  }
  
  if (hasPassedQuiz && chapterIndex < totalChapters - 1) {
    return <button onClick={navigateToNextChapter} className="flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-gray-800 rounded-md hover:bg-gray-900 transition-colors"><ArrowRight /> Go to Next Chapter</button>;
  }

  if (hasPassedQuiz && chapterIndex === totalChapters - 1) {
    return <div className="flex items-center justify-center gap-2 px-6 py-3 font-semibold text-green-700 bg-green-100 rounded-md"><CheckCircle /> Course Complete!</div>;
  }

  return null;
};

export default ActionButtons;