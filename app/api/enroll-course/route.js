import { NextResponse } from "next/server";
import { db } from '../../config/db';
import { enrollCourseTable } from '../../config/schema';
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    const user = await currentUser();
    if (!user || !user.primaryEmailAddress) {
      return new NextResponse("User not authenticated", { status: 401 });
    }
    const userEmail = user.primaryEmailAddress.emailAddress;

    const { courseId } = await req.json(); // Expecting the course's UUID (cid)

    if (!courseId) {
      return new NextResponse("Bad Request: courseId is required", { status: 400 });
    }
    
    // Create a new enrollment record for the user and course
    const newEnrollment = await db.insert(enrollCourseTable).values({
      courseId: courseId,
      userEmail: userEmail,
      // completedChapters defaults to an empty array in the schema
    }).returning({
      id: enrollCourseTable.id
    });

    return NextResponse.json({ success: true, enrollmentId: newEnrollment[0].id });

  } catch (error) {
    console.error("Error enrolling in course:", error);
    // Handle unique constraint violation (user is already enrolled)
    if (error.code === '23505') { 
        return NextResponse.json({ error: "User is already enrolled in this course." }, { status: 409 });
    }
    return new NextResponse("Internal Server Error: " + error.message, { status: 500 });
  }
}