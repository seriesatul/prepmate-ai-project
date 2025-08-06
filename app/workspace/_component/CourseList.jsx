"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import AddNewCourseDialogBox from './AddNewCourseDialogBox.jsx';
import CourseCard from './CourseCard.jsx'; // Import the new card component

const CourseList = () => {
    const [courseList, setCourseList] = useState([]);
    const [loading, setLoading] = useState(true); // Add a loading state

    // Function to fetch the courses
    const fetchCourses = async () => {
        try {
            const response = await axios.get('/api/user-courses');
            setCourseList(response.data);
        } catch (error) {
            console.error("Failed to fetch courses:", error);
        } finally {
            setLoading(false);
        }
    };

    // Use useEffect to fetch the data when the component mounts
    useEffect(() => {
        fetchCourses();
    }, []);

    return (
        <div className='p-4 sm:p-8'>
            <div className='flex justify-between items-center mb-8'>
                <h1 className='text-3xl sm:text-4xl font-bold text-gray-800'>My Courses</h1>
                <AddNewCourseDialogBox>
                    <button className='bg-zinc-900 hover:bg-zinc-800 px-5 py-3 text-white rounded-lg shadow-md transition-transform hover:scale-105'>
                        + Create New Course
                    </button>
                </AddNewCourseDialogBox>
            </div>
            
            {loading ? (
                // --- Loading State ---
                <div className='flex justify-center items-center h-[60vh]'>
                    <Loader2 className='w-12 h-12 animate-spin text-zinc-900' />
                </div>
            ) : courseList.length === 0 ? (
                // --- Empty State ---
                <div className='w-full text-center h-[60vh] flex flex-col justify-center items-center bg-gray-50 rounded-lg border-2 border-dashed'>
                    <h2 className='text-2xl font-semibold text-gray-700'>Looks like you haven't created any courses yet!</h2>
                    <p className='text-gray-500 mt-2 mb-6'>Let's get started.</p>
                    <AddNewCourseDialogBox>
                        <button className='bg-zinc-900 m-2 px-6 py-4 text-white rounded-full text-lg font-semibold shadow-lg transition-transform hover:scale-105'>
                            Create Your First Course
                        </button>
                    </AddNewCourseDialogBox>
                </div>
            ) : (
                // --- List of Courses ---
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                    {courseList.map((course) => (
                        <CourseCard key={course.id} course={course}  onEnrollmentUpdate={fetchCourses}  onCourseDeleted={fetchCourses}   />
                    ))}
                </div>
            )}
        </div>
    );
}

export default CourseList;