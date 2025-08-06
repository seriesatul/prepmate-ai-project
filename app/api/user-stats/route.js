import { NextResponse } from "next/server";
import { db } from '../../config/db';
import { courseTable, enrollCourseTable } from '../../config/schema';
import { eq, count } from 'drizzle-orm';
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user || !user.primaryEmailAddress) {
      return new NextResponse("User not authenticated", { status: 401 });
    }
    const userEmail = user.primaryEmailAddress.emailAddress;

    // --- 1. Count Courses Created by the User ---
    const createdResult = await db.select({
        value: count()
      })
      .from(courseTable)
      .where(eq(courseTable.userId, userEmail));

    const coursesCreated = createdResult[0].value;

    // --- 2. Count Courses the User is Enrolled In ---
    const enrolledResult = await db.select({
        value: count()
      })
      .from(enrollCourseTable)
      .where(eq(enrollCourseTable.userEmail, userEmail));
      
    const coursesEnrolled = enrolledResult[0].value;

    // --- 3. Return the stats ---
    return NextResponse.json({
      coursesCreated,
      coursesEnrolled,
    });

  } catch (error) {
    console.error("Error fetching user stats:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}