"use client"
import axios from 'axios';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import CourseInfo from '../_components/CourseInfo';
import ChapterTopicList from '../_components/ChapterTopicList'


const EditCourse = () => {
    const {courseID} = useParams();
    // Keep loading state as-is
    const [loading, setLoading] = useState(false);
    const [course, setCourse] = useState();

    useEffect(()=>{
        // No change needed here
        GetCourseInfo();
    },[])

    const GetCourseInfo = async () => {
        setLoading(true);
        try { // It's good practice to wrap API calls in try/catch
            const result = await axios.get(`/api/courses?courseId=${courseID}`);
            const courseData = result.data;
               if (courseData && typeof courseData.courseJson === 'string') {
              // 2. If it's a string, parse it into a real JavaScript object.
              courseData.courseJson = JSON.parse(courseData.courseJson);
            }
            
            console.log("Corrected Course Data:", courseData);
            setCourse(courseData);
        } catch (error) {
            console.error("Failed to fetch course info:", error);
        }
        setLoading(false);
    }

  // --- THIS IS THE FIX ---
  // Add a conditional render to handle the loading and initial state.
  return (
    <div>
        {loading ? (
            <p>Loading course details...</p>
        ) : course ? (
            // Only render CourseInfo when 'course' is not null or undefined
            <CourseInfo course={course}/>
        ) : (
            <p>Course not found.</p>
        )}

        <ChapterTopicList course = {course}/>
    </div>
  )
}

export default EditCourse;