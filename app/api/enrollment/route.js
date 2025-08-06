import { NextResponse } from "next/server";
import { db } from '../../config/db';
import { enrollCourseTable } from '../../config/schema';
import { eq, and } from 'drizzle-orm';
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req) {
  try {
    const user = await currentUser();
    if (!user || !user.primaryEmailAddress) {
      return new NextResponse("User not authenticated", { status: 401 });
    }
    const userEmail = user.primaryEmailAddress.emailAddress;
    
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return new NextResponse("Bad Request: courseId is required", { status: 400 });
    }

    // Find the specific enrollment record for this user and this course
    const enrollment = await db.select()
      .from(enrollCourseTable)
      .where(and(
        eq(enrollCourseTable.courseId, courseId),
        eq(enrollCourseTable.userEmail, userEmail)
      ));

    // Return the first record found, or null if not enrolled
    return NextResponse.json(enrollment[0] || null);

  } catch (error) {
    console.error("Error fetching enrollment:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}