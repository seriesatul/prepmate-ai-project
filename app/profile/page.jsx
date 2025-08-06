"use client";

import React, { useState, useEffect } from 'react';
import { UserProfile } from "@clerk/nextjs";
import axios from 'axios';
import { Loader2, BookUp, GraduationCap } from 'lucide-react';
import StatCard from './_components/StatCard';

const ProfilePage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('/api/user-stats');
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch user stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="p-4 sm:p-8 bg-gray-50 min-h-full">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">My Profile</h1>
            
            {/* --- Custom Statistics Section --- */}
            <div className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Activity</h2>
                {loading ? (
                    <div className="flex justify-center items-center h-24">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                    </div>
                ) : stats ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <StatCard 
                            icon={BookUp} 
                            label="Courses Created" 
                            value={stats.coursesCreated}
                            colorClass="bg-indigo-500"
                        />
                        <StatCard 
                            icon={GraduationCap} 
                            label="Courses Enrolled" 
                            value={stats.coursesEnrolled}
                            colorClass="bg-green-500"
                        />
                        {/* You can add more stats here in the future, like "Quizzes Passed" */}
                    </div>
                ) : (
                    <p className="text-gray-500">Could not load your activity stats.</p>
                )}
            </div>

            {/* --- Clerk's Account Management Section --- */}
            <div>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Account Settings</h2>
                <div className="bg-white p-2 sm:p-4 rounded-lg shadow-md">
                    <UserProfile 
                        appearance={{
                            elements: {
                                card: "shadow-none", // Remove Clerk's default shadow to blend in
                                rootBox: "w-full",
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;