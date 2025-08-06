"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import ChapterSidebar from '../_components/ChapterSidebar';
import ContentDisplay from '../_components/ContentDisplay';
import { Loader2 } from 'lucide-react';

const ContentGenerationPage = () => {
  const { courseId } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams(); // To read URL query params
  
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  // This function fetches ALL necessary data for the page
  const getPageData = async () => {
    try {
      // Fetch course and enrollment data in parallel for better performance
      const [courseRes, enrollRes] = await Promise.all([
        axios.get(`/api/courses?courseId=${courseId}`),
        axios.get(`/api/enrollment?courseId=${courseId}`)
      ]);
      
      const courseData = courseRes.data;
      if (courseData && typeof courseData.courseJson === 'string') {
        courseData.courseJson = JSON.parse(courseData.courseJson);
      }
      setCourse(courseData);
      setEnrollment(enrollRes.data);

    } catch (error) {
      console.error("Failed to fetch page data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      getPageData();
    }
  }, [courseId]);

  // This effect handles advancing the chapter after a quiz
  useEffect(() => {
    const chapterFromUrl = searchParams.get('chapter');
    if (chapterFromUrl) {
        const chapterIndex = parseInt(chapterFromUrl, 10);
        if (!isNaN(chapterIndex)) {
            setActiveChapterIndex(chapterIndex);
        }
    }
  }, [searchParams]);

  // This is called when content/quiz is generated OR when "Next Chapter" is clicked
  const handleUpdate = (nextChapterIndex) => {
    if (typeof nextChapterIndex === 'number' && nextChapterIndex < (course?.courseJson?.courseList?.length || 0)) {
        setActiveChapterIndex(nextChapterIndex);
    } else {
        getPageData(); // Refresh all data from the database
    }
  };

  // This controls sidebar navigation, preventing access to locked chapters
  const handleChapterSelect = (index) => {
    const chapters = course?.courseJson?.courseList || [];
    const passedChapters = enrollment?.passedChapters || [];

    // Chapter is unlocked if it's the first one, or if the PREVIOUS chapter has been passed.
    if (index === 0 || passedChapters.includes(chapters[index - 1]?.title)) {
        setActiveChapterIndex(index);
    } else {
        alert("Please complete the previous chapter's quiz to unlock this one.");
    }
  };


  if (loading) {
    return (
      <div className="flex heading justify-center items-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-zinc-900" />
      </div>
    );
  }

  if (!course) {
    return <div className="text-center heading mt-20">Course not found.</div>;
  }
  
  const chapters = course.courseJson?.courseList || [];
  const activeChapter = chapters[activeChapterIndex];
  
  // The 'hasPassedQuiz' logic now correctly uses the fetched enrollment state
  const hasPassedQuiz = enrollment?.passedChapters?.includes(activeChapter?.title);

  return (
    <div className="flex h-screen bg-gray-50">
      <ChapterSidebar 
        chapters={chapters}
        activeChapterIndex={activeChapterIndex}
        onChapterSelect={handleChapterSelect} // Use the new controlled function
        enrollment={enrollment} // Pass enrollment data down for visual indicators
      />

      <main className="flex-1 p-8 overflow-y-auto">
         <ContentDisplay 
          chapter={activeChapter}
          courseId={courseId}
          courseName={course.courseName}
          chapterIndex={activeChapterIndex}
          totalChapters={chapters.length}
          hasPassedQuiz={hasPassedQuiz}
          onUpdate={handleUpdate}
        />
      </main>
    </div>
  );
};

export default ContentGenerationPage;