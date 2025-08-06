import { NextResponse } from "next/server";
import { db } from '../../config/db';
import { courseTable, enrollCourseTable } from '../../config/schema';
import { eq, desc } from 'drizzle-orm';
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user || !user.primaryEmailAddress) {
      return new NextResponse("User not authenticated", { status: 401 });
    }
    const userEmail = user.primaryEmailAddress.emailAddress;

    // --- This query finds all enrollments for the user and joins the course data ---
    const enrolledCourses = await db.select({
        // We select the full course object and the full enrollment object
        course: courseTable,
        enrollment: enrollCourseTable,
      })
      .from(enrollCourseTable)
      // Join 'courses' where the enrollment's courseId matches the course's cid
      .innerJoin(courseTable, eq(enrollCourseTable.courseId, courseTable.cid))
      // Filter to get only the enrollments for the currently logged-in user
      .where(eq(enrollCourseTable.userEmail, userEmail))
      .orderBy(desc(enrollCourseTable.id)); // Show the most recently enrolled courses first

    // Process the data to calculate progress percentage, just like in the other route
    const processedCourses = enrolledCourses.map(({ course, enrollment }) => {
      // Safely parse courseJson if it's a string
      let parsedCourseJson = course.courseJson;
      if (typeof parsedCourseJson === 'string') {
        try {
            parsedCourseJson = JSON.parse(parsedCourseJson);
        } catch (e) {
            parsedCourseJson = { courseList: [] };
        }
      }

      const courseList = parsedCourseJson?.courseList || [];
      const totalChapters = courseList.length;
      
      const completedChapters = enrollment?.completedChapters || [];
      const passedChapters = enrollment?.passedChapters || []; // Assuming you track quiz passes
      const progress = totalChapters > 0 ? Math.round((passedChapters.length / totalChapters) * 100) : 0;

      return {
        ...course,
        courseJson: parsedCourseJson,
        isEnrolled: true, // They are all enrolled by definition
        progress: progress,
      };
    });

    return NextResponse.json(processedCourses);

  } catch (error) {
    console.error("Error fetching 'My Learning' courses:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}