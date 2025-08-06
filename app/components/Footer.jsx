import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <div className=' mx-30 flex justify-around items-center h-[50vh]'>
        <div className='w-2/3'>
         <h1 className="text-9xl font-semibold leading-none drop-shadow-lg">prepMate<span className='text-2xl headline'>@i</span></h1></div>
         <div className='w-1/3 flex gap-3 justify-around items-start'>
         <div className='w-1/3'>
         <h4 className='font-sans my-5 '>Socials</h4>
         <ul className='flex flex-col'>
            <li className='text-sm'>LinkedIn</li>
            <li className='text-sm '>Github</li>
            <li className='text-sm '>Portfolio</li>
         </ul>
         </div>
          <div className='w-1/3 flex flex-col gap-2'>
          <h4 className='font-sans my-5'>Sitemap</h4>
          <ul className='flex text-sm flex-col'>
            <li><Link href="/workspace">Dashboard</Link></li>
            <li>  <Link href="/my-learning">My Learning</Link></li>
            <li> <Link href="/profile">Profile</Link></li>
            <li><Link href="/explore">Explore</Link></li>
          </ul>
          
        
         
          </div>
          <div className='w-1/3 flex flex-col gap-3 justify-center items-center'>
            <p className='my-5 text-sm'>This is my project made by pre final year student </p> 
            <p className='bg-blue-600 py-1 px-2 leading-none font-semibold text-nowrap text-white font-sans text-sm'>Atul Singh Chauhan</p>
          </div>
         
         </div>
    </div>
  )
}

export default Footer