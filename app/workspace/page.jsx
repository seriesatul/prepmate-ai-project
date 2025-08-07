"use client";
import React from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import CourseList from './_component/CourseList'



const workspace = (children) => {
  return (
    <div>
      <Sidebar/>
      <CourseList/>
    </div>
  )
}

export default workspace