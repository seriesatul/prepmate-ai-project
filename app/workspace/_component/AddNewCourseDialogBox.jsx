"use client";


import React, { useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// ... (your other imports remain the same)
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
} from "@/components/ui/alert-dialog.jsx";
import { Switch } from "@/components/ui/switch.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useRouter } from 'next/navigation';


const AddNewCourseDialogBox = ({ children }) => {
  const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const router = useRouter();
  const [formData, setFormData] = useState({
    courseName: '',
    courseDescription: '',
    courseChapters: 0,
    includeVideo: false,
    level: '',
    courseCategory: ''
  });

  const onHandleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // In AddNewCourseDialogBox.jsx

const onGenerate = async () => {
  const courseID = uuidv4();

  if (!formData.courseName || !formData.level || !formData.courseDescription || !formData.courseChapters || !formData.courseCategory) {
    alert("Please fill out ALL fields before generating.");
    return;
  }

  setLoading(true);

  // This is the object that will be sent to the API.
  const payload = {
    courseName: formData.courseName,
    courseDescription: formData.courseDescription,
    courseChapters: formData.courseChapters,
    includeVideo: formData.includeVideo,
    courseCategory: formData.courseCategory,
    topic: formData.courseName,
    difficulty: formData.level,
    learningObjectives: formData.courseDescription ? [formData.courseDescription] : [],
  };

  // --- THIS IS THE MOST IMPORTANT LINE FOR DEBUGGING ---
  // We will look for this message in the browser console.
  console.log("✅ VERIFYING PAYLOAD. All fields should be here:", payload);

  try {
    // The key in the payload sent to the API is '...payload' not '...requestData'
    const result = await axios.post('/api/generate-course-list', payload);
    
    console.log("✅ Success! API Response:", result.data);


    if (result.data.courseID) {
      setOpen(false);
      router.push(`/workspace/edit-course/`+ result.data?.courseID);
     
    }

  } catch (e) {
    console.error("❌ Error generating course:", e.response ? e.response.data : e.message);
    alert("Failed to generate the course. Please check the browser console for details.");
  } finally {
    setLoading(false);
  }
};

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className='h-[80vh]'>
          <AlertDialogTitle className=' heading my-2 text-5xl'>Let&apos;s get started with your New Course</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className='heading'>
              <input type="text" placeholder="Course Name" onChange={(event) => onHandleInputChange('courseName', event?.target.value)} className="my-2 w-full p-5 h-12 border-2 border-zinc-500" />
              <textarea placeholder='Course Description' onChange={(event) => onHandleInputChange('courseDescription', event?.target.value)} name="course-description" className="my-4 w-full p-5 border-2 border-zinc-500" rows="5" id=""></textarea>
              <input type="number" placeholder="No. of Chapters" onChange={(event) => onHandleInputChange('courseChapters', Number(event.target.value))} className="my-2 w-full p-5 h-12 border-2 border-zinc-500" />

              <div className=' my-2 mx-2 items-center flex gap-2'>
                <label>Include Video</label>
                <Switch onCheckedChange={() => onHandleInputChange('includeVideo', !formData?.includeVideo)} />
                <div className='mx-2'>
                  <Select onValueChange={(value) => onHandleInputChange('level', value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue className=" my-2 w-full p-5 h-12 border-2 border-zinc-500" placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <input type="text" placeholder="Category" onChange={(event) => onHandleInputChange('courseCategory', event?.target.value)} className="my-2 w-full p-5 h-12 border-2 border-zinc-500" />
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='flex gap-2 items-center'>
          {loading ? <button className='bg-zinc-950 px-2 py-2 text-white rounded-md' disabled>Generating...</button> : <button onClick={onGenerate} className='bg-zinc-950 px-2 py-2 text-white rounded-md'>Generate Course</button>}
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddNewCourseDialogBox;