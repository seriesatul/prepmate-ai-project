"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { BookOpen, Loader2, Trash2 } from 'lucide-react'; // --- 1. Import the Trash2 icon ---

// --- 2. Import the AlertDialog components ---
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// --- 3. Add 'onCourseDeleted' to the list of props ---
const CourseCard = ({ course, onEnrollmentUpdate, onCourseDeleted }) => {
    const router = useRouter();
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await axios.delete(`/api/delete-course?courseId=${course.cid}`);
            // This now correctly calls the prop passed from CourseList.jsx
            onCourseDeleted(); 
        } catch (error) {
            console.error("Deletion failed:", error);
            alert("Failed to delete the course. Please try again.");
            setIsDeleting(false);
        }
    };

    const handleEnroll = async (e) => {
        e.preventDefault();
        setIsEnrolling(true);
        try {
            await axios.post('/api/enroll-course', { courseId: course.cid });
            router.push(`/workspace/content/${course.cid}`);
        } catch (error) {
            console.error("Enrollment failed:", error);
            alert("Failed to enroll in the course. You might already be enrolled.");
        } finally {
            setIsEnrolling(false);
        }
    };
  
    return (
        // --- 4. Wrap the entire card in the AlertDialog component ---
        <AlertDialog>
            <div className="group relative rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300 bg-white flex flex-col">
                
              
                {/* The rest of your card content remains the same */}
                <Link href={`/workspace/content/${course.cid}`} passHref className="flex-grow flex flex-col">
                    <div className="aspect-video w-full rounded-t-lg overflow-hidden">
                        <img
                            src={course.bannerImageUrl}
                            alt={`Banner for ${course.courseName}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                    
                    <div className="p-4 flex-grow flex flex-col">
                      <div className='flex justify-between items-center'> 
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-zinc-900 transition-colors">
                            {course.courseName}
                        </h3>
                        
                        {/* --- 5. Add the Delete Button as the AlertDialogTrigger --- */}
                <AlertDialogTrigger asChild>
                    <button className="absolute top-2 right-2 z-10 p-1.5 bg-white/60 backdrop-blur-sm rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </AlertDialogTrigger>
                




                        </div>
                       
                        <p className="mt-1 text-xs text-gray-500">{course.courseCategory} | {course.level}</p>
                        
                        <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                            <BookOpen className='w-4 h-4 text-gray-400'/>
                            {course.courseJson?.courseList?.length || 0} Chapters
                        </div>

                        {course.isEnrolled && (
                            <div className="mt-auto pt-4"> {/* Use mt-auto to push progress bar down */}
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div 
                                        className="bg-zinc-900 h-2.5 rounded-full transition-all duration-500" 
                                        style={{ width: `${course.progress}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-right text-gray-500 mt-1">{course.progress}% Complete</p>
                            </div>
                        )}
                    </div>
                </Link>

                <div className="p-4 pt-0">
                    {course.isEnrolled ? (
                        <Link href={`/workspace/content/${course.cid}`} passHref>
                            <button className="w-full text-center px-4 py-2 font-semibold text-zinc-900 bg-zinc-100 rounded-md hover:bg-zinc-200">
                                Continue Learning
                            </button>
                        </Link>
                    ) : (
                        <button
                            onClick={handleEnroll}
                            disabled={isEnrolling}
                            className="w-full flex justify-center items-center px-4 py-2 font-semibold text-white bg-zinc-900 rounded-md hover:bg-zinc-800 disabled:bg-zinc-300"
                        >
                            {isEnrolling ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Start Learning'}
                        </button>
                    )}
                </div>
            </div>

            {/* --- 6. Add the content for the Confirmation Dialog --- */}
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the course
                        <strong className="text-gray-900"> "{course.courseName}" </strong>
                        and all of its associated data, including all user enrollments and progress.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Yes, delete course"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default CourseCard;