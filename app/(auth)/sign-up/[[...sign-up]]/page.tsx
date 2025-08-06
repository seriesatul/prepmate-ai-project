import { SignUp } from '@clerk/nextjs'
import React from 'react'

export default function Page() {
  return (
    <>
    <div className='h-screen w-full flex items-center justify-center'>
    <SignUp />    
     </div>
    </>
  )
}