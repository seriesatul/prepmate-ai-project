import React, { useEffect, useState } from 'react';
import { Tag, BarChart3, Clock } from 'lucide-react';
import Link from 'next/link';

// A simple component to render the "Include Video" badge
const VideoBadge = ({ includeVideo }) => {
  if (!includeVideo) return null;

  return (
    <span className="bg-blue-100 text-zinc-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
      Includes Video
    </span>
  );
};

// You would pass the course object as a prop


  // A helper function to determine the color for the level badge
  const getLevelStyles = (level) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

   const getCategoryStyles = (category) => {
    // This is just an example, you can expand this map
    const colorMap = {
        'Programming': 'bg-blue-100 text-blue-800',
        'Marketing': 'bg-teal-100 text-teal-800',
        'Engineering': 'bg-orange-100 text-orange-800',
    }
    return colorMap[category] || 'bg-purple-100 text-purple-800';
  };
const CourseInfo = ({ course }) => {
  
  // Defensive check: If the course object is not yet loaded, show nothing.
  // The loading message is handled by the parent component (page.jsx).
  if (!course) {
    return null;
  }

 const calculateTotalDuration = (course) => {
  // 1. Safely access the course list.
  const courseList = course?.courseJson?.courseList;

  // 2. Check if the courseList is a valid array.
  if (!Array.isArray(courseList) || courseList.length === 0) {
    return 0;
  }

  // 3. Use a simple loop for the calculation. This is the most reliable method.
  let totalDuration = 0;
  for (const chapter of courseList) {
    // 4. Check if the chapter has a 'duration' property AND that it's a number.
    if (chapter && typeof chapter.duration === 'number') {
      // 5. If it's a valid number, add it to the total.
      totalDuration += chapter.duration;
    }
  }

  // 6. Return the final sum.
  return totalDuration;
};

  const totalDuration = calculateTotalDuration(course);

  

  // Safely access the course list, providing a default empty array if it's missing
  const courseOutline = course.courseJson?.courseList || [];

  const generateCourseContent = () =>{
    //Call API to get course content
  }
  
  return (
    <div className='main my-20 mx-10 h-full'>
      <div className=' m-4 h-full flex justify-evenly  '>
        <div className='flex flex-col m-10 w-1/2 heading justify-between items-start'>
        <h1 className=' text-9xl font-bold w-1/2'>{course.courseName}</h1>
        <p className='text-sm w-1/2 my-10'>{course.courseDescription}</p></div>
       <div className='w-1/2 flex flex-col justify-center items-baseline-last'>
        
         {course.bannerImageUrl && (
          <div className="w-full aspect-video rounded-lg overflow-hidden shadow-lg mt-[30vh]">
            <img
              src={course.bannerImageUrl}
              alt={`Banner for ${course.courseName}`}
              className="w-full h-full object-cover"
            />
          </div>
        )}

         {/* --- NEW: Call-to-Action Button --- */}
            <div className="mt-6 w-full">
              <Link href={`/workspace/content/${course.cid}`} passHref>
                <button className="w-92 heading flex items-center justify-center gap-2 px-4 py-5 text-lg font-bold text-white bg-zinc-900 rounded-full shadow-lg  transition-transform hover:scale-105">
                  Start Learning
                 
                </button>
              </Link>
            </div>
        
        
        </div>
         
      </div>
      <div className='course-description heading flex gap-2 text-center justify-evenly w-full mx-4 my-10'>
     {/* Div 1: Course Category */}
      <div className={`flex w-1/3 mx-10 items-center px-3 py-5 rounded-full ${getCategoryStyles(course.courseCategory)}`}>
        <Tag className="mr-2" />
        <span className="font-semibold text-center text-sm"><strong>Category:</strong>{course.courseCategory}</span>
      </div>

      {/* Div 2: Course Level */}
      <div className={`flex  w-1/3 mx-10 items-center px-3 py-5 rounded-full ${getLevelStyles(course.level)}`}>
        <BarChart3 className="mr-2" />
        <span className="font-semibold text-center text-sm"><strong>Difficulty:</strong>{course.level}</span>
      </div>

      {/* Div 3: Course Duration */}
      <div className="flex w-1/3 mx-10 items-center px-3 py-5 rounded-full bg-gray-100 text-gray-800">
        <Clock className="mr-2" />
        <span className="font-semibold text-center text-sm"><strong>Duration:</strong>{totalDuration} hours</span>
      </div>
    
      </div>
    </div>
  );
};

export default CourseInfo;