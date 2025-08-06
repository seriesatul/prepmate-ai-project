"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from "@clerk/nextjs"; // Assuming you use Clerk for the profile
import { BrainCircuit, LayoutDashboard, Compass, BookOpenCheck, User } from 'lucide-react';
import clsx from 'clsx';
import AddNewCourseDialogBox from "../workspace/_component/AddNewCourseDialogBox";

export default function Sidebar() {
   const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navLinks = [
    {
      name: 'Dashboard',
      href: '/workspace', // The Next.js route
      icon: LayoutDashboard,
    },
    {
      name: 'My Learning',
      href: '/my-learning',
      icon: BookOpenCheck,
    },
    {
      name: 'Explore Courses',
      href: '/explore',
      icon: Compass,
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: User,
    },
  ];

  return (
    <>
      {/* Top bar with Menu button */}
      <div className="fixed heading rounded-full mx-5 my-10 top-0 left-0 right-0 z-40 h-14 flex items-center justify-between px-4 ">
        <button
          onClick={() => setOpen(true)}
          aria-controls="app-sidebar"
          aria-expanded={open}
          className="d border rounded-full bg-zinc-50 px-3 py-1 text-sm"
        >
         <div className="flex items-center p-2 font-bold rounded-full text-black ">
          <Image src="/logo.png" alt="logo" width={40} height={40} />
          <h2 className="text-2xl">Prepmate</h2>
          </div>
        </button>
       <div className="flex items-center gap-2">

     <AddNewCourseDialogBox>
         <button className="p-4 text-center border-2 rounded-full border-black ">Create Course</button>
     </AddNewCourseDialogBox>
          <button className="p-4 text-center rounded-full bg-zinc-950 text-white"> Start Your Interview</button>

       </div>
      </div>

      {/* Overlay */}
      <button
        title="Close sidebar"
        aria-label="Close sidebar overlay"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sidebar panel */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 left-0 z-50 h-screen w-92 transform transition-transform duration-300
         bg-zinc-950 text-white heading
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
        role="dialog"
        aria-modal="true"
      >
        {/* Sidebar header */}
        <div className="flex my-10 items-center justify-between h-14 px-4 ">
         <div className="flex items-center gap-2 ">
          <Image className="rounded-sm" src="/logo.png" alt="logo" width={40} height={40} />
          <h2 className="text-2xl">Prepmate</h2>
          </div>
         
          <button
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="rounded-md border border-white/30 px-2 py-1 hover:bg-white/10"
          >
            ✕
          </button>
        </div>


            <nav className="flex-grow border-t border-white/20">
        <ul className="space-y-2">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className={clsx(
                  'flex items-center p-3 text-base font-normal rounded-lg transition-colors duration-200',
                  {
                    // This is the style for the ACTIVE link
                    ' text-white shadow-lg': pathname === link.href,
                    // This is the style for INACTIVE links
                    'text-gray-300 hover:bg-gray-600 hover:text-white': pathname !== link.href,
                  }
                )}
              >
                <link.icon className="w-6 h-6" />
                <span className="ml-3">{link.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

        <div className="mt-auto">
        <div className="pt-4 border-t border-gray-700">
          <div className="flex items-center gap-4 p-2">
            <UserButton afterSignOutUrl="/" />
            <div className='text-sm font-medium'>
                Your Account
            </div>
          </div>
        </div>
      </div>

       
        {/* Gradient can make lower area light; enforce readable text */}
        <style jsx>{`
          aside { color: #fff; }
          aside a { color: inherit; }
        `}</style>
      </aside>
    </>
  );
}
