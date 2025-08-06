import React from 'react'
import Card from './Card'

function Cards() {
  return (
    <div className='w-full'>
        <div className='max-w-screen-xl mx-auto py-20 flex gap-3'>
            <Card width={"basis-1/3"} headingFirst={"Elevate your Learning"} headingSecond={"Create New Course"} paragraph={"The smartest way to build your next curriculum"} hover={"bg-amber-300"}/>
            <Card width={"basis-2/3"} headingFirst={"Be more confident on your Expertise"} headingSecond={"Prepare for your next Interview"} paragraph={"Walk into any interview with total confidence."}/>
        </div>
    </div>
  )
}

export default Cards