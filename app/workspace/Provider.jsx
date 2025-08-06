"use client";
import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

const WorkspaceProvider = ({children}) => {

   
  return (
   
    <div className='w-full min-h-screen relative'> 
    {children} 
    </div>
  )
}

export default WorkspaceProvider