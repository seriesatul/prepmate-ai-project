import { NextResponse } from "next/server";
import { db } from '../../config/db';
import { courseTable, enrollCourseTable } from '../../config/schema';
import { eq, and } from 'drizzle-orm';
import { currentUser } from "@clerk/nextjs/server";

// Using the DELETE HTTP method is the standard for deletion operations
export async function DELETE(req) {
  try {
    const user = await currentUser();
    if (!user || !user.primaryEmailAddress) {
      return new NextResponse("User not authenticated", { status: 401 });
    }
    const userEmail = user.primaryEmailAddress.emailAddress;

    // Get the courseId (UUID) from the request's query parameters
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return new NextResponse("Bad Request: courseId is required", { status: 400 });
    }
    
    // --- Security Check ---
    // First, verify that the course exists and that the current user is the one who created it.
    // This prevents one user from deleting another user's course.
    const course = await db.select()
      .from(courseTable)
      .where(and(
        eq(courseTable.cid, courseId),
        eq(courseTable.userId, userEmail)
      ));

    if (course.length === 0) {
      return new NextResponse("Forbidden: Course not found or you don't have permission to delete it.", { status: 403 });
    }
    
    // --- Deletion Logic ---
    // 1. Delete all enrollment records associated with this course to avoid foreign key issues.
    await db.delete(enrollCourseTable).where(eq(enrollCourseTable.courseId, courseId));
    
    // 2. Delete the course itself.
    await db.delete(courseTable).where(eq(courseTable.cid, courseId));
    
    // 3. Return a success response
    return NextResponse.json({ success: true, message: "Course deleted successfully." });

  } catch (error) {
    console.error("Error deleting course:", error);
    return new NextResponse("Internal Server Error: " + error.message, { status: 500 });
  }
}