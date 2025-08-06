import React from 'react'
import { ArrowRight } from 'lucide-react'

function Card({width,headingFirst,headingSecond,paragraph,background,foreground}) {
  return (
    <div className={` flex flex-col justify-between ${background} ${foreground} h-[23rem] p-10 rounded-xl ${width}  `}>
    <div className='w-full'>
          <div className=' w-full justify-between items-center flex'>
          <h1>Card</h1>
          <ArrowRight />
      </div>
      <h1 className='text-2xl font-medium font-sans mt-5'>{headingFirst} </h1>
    </div>

     <div className='w-full down'>
        <h1 className='text-6xl font-sans font-semibold tracking-tight leading-none'>{headingSecond}</h1>
        <p className='my-3'>{paragraph}</p>
     </div>


    </div>
  )
}

export default Card