"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Sparkles } from 'lucide-react';
import CourseCard from '../../app/workspace/_component/CourseCard'; // Reuse your existing CourseCard component

const ExplorePage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchExploreData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/explore-courses');
            setData(response.data);
        } catch (error) {
            console.error("Failed to fetch explore data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExploreData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-[80vh]">
                <Loader2 className="w-12 h-12 animate-spin text-zinc-500 mb-4" />
                <p className="text-gray-600">Our AI is curating the best courses for you...</p>
            </div>
        );
    }

    if (!data || !data.recommendedCourses) {
        return <div className="text-center mt-20">Could not load recommendations. Please try again.</div>;
    }

    return (
        <div className="p-4 sm:p-8 bg-gray-50 min-h-full">
            <div className="max-w-7xl mx-auto">
                {/* --- AI Generated Header --- */}
                <div className="text-center mb-12">
                    <Sparkles className="w-10 h-10 mx-auto text-yellow-500 mb-2" />
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">
                        {data.recommendationTitle}
                    </h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        {data.recommendationReason}
                    </p>
                </div>

                {/* --- Grid of Recommended Courses --- */}
                {data.recommendedCourses.length > 0 ? (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                        {data.recommendedCourses.map((course) => (
                            // We need to pass a dummy onEnrollmentUpdate function or adapt the card
                            <CourseCard key={course.id} course={course} onEnrollmentUpdate={fetchExploreData} onCourseDeleted={fetchExploreData}/>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500">
                        <p>No public courses are available right now. Check back later!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExplorePage;