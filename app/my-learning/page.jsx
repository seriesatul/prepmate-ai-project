"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, BookOpenCheck } from 'lucide-react';
import CourseCard from '../../app/workspace/_component/CourseCard'; // Reuse your existing card!
import Link from 'next/link';

const MyLearningPage = () => {
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyLearning = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/my-learning');
            setEnrolledCourses(response.data);
        } catch (error) {
            console.error("Failed to fetch my learning courses:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyLearning();
    }, []);

    return (
        <div className="p-4 sm:p-8 bg-gray-50 min-h-full">
            
            <div className="max-w-7xl mx-auto">
                {/* --- Header --- */}
                <div className="mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">My Learning</h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Continue your learning journey and track your progress.
                    </p>
                </div>

                {/* --- Conditional Rendering --- */}
                {loading ? (
                    <div className="flex justify-center items-center h-[60vh]">
                        <Loader2 className="w-12 h-12 animate-spin text-zinc-800" />
                    </div>
                ) : enrolledCourses.length === 0 ? (
                    // --- Empty State ---
                    <div className="w-full text-center h-[60vh] flex flex-col justify-center items-center bg-white rounded-lg border-2 border-dashed">
                        <BookOpenCheck className="w-16 h-16 text-gray-400 mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-700">You haven't enrolled in any courses yet.</h2>
                        <p className="text-gray-500 mt-2 mb-6">Head over to the Explore page to find your next course!</p>
                        <Link href="/explore">
                            <button className='bg-indigo-600 m-2 px-6 py-3 text-white rounded-lg text-md font-semibold shadow-lg transition-transform hover:scale-105'>
                                Explore Courses
                            </button>
                        </Link>
                    </div>
                ) : (
                    // --- Grid of Enrolled Courses ---
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                        {enrolledCourses.map((course) => (
                            // We reuse the CourseCard component.
                            // The card's logic will automatically show the "Continue Learning" button and progress bar.
                            <CourseCard 
                                key={course.id} 
                                course={course} 
                                // We can pass a refresh function if needed, but it's less critical here
                                onEnrollmentUpdate={fetchMyLearning} 
                                onCourseDeleted={fetchMyLearning}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyLearningPage;