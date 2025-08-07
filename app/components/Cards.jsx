import React from 'react'
import Card from './Card'
import AddNewCourseDialogBox from '../workspace/_component/AddNewCourseDialogBox'

function Cards() {
  return (
    <div className='w-full'>
        <div className='max-w-screen-xl mx-auto py-20 flex gap-3'>

                  <AddNewCourseDialogBox>
                     <Card width={"basis-1/3"} headingFirst={"Elevate your Learning"} headingSecond={"Create New Course"} paragraph={"The smartest way to build your next curriculum"} background={"bg-blue-600"} foreground={"text-zinc-50"}/>
                  </AddNewCourseDialogBox>
                
           


            <Card width={"basis-2/3"} headingFirst={"Be more confident on your Expertise"} headingSecond={"Prepare for your next Interview"} paragraph={"Walk into any interview with total confidence."} background={"bg-zinc-200"} foreground={"text-zinc-900"}
             />
        </div>
    </div>
  )
}

export default Cards