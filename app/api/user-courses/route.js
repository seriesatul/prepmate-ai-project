import { NextResponse } from "next/server";
import { db } from '../../config/db';
import { courseTable, enrollCourseTable } from '../../config/schema';
import { eq, desc, and } from 'drizzle-orm';
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req) {
  try {
    const user = await currentUser();
    if (!user || !user.primaryEmailAddress) {
      return new NextResponse("User not authenticated", { status: 401 });
    }
    const userEmail = user.primaryEmailAddress.emailAddress;
    
    const userCoursesAndProgress = await db
      .select({
        course: courseTable,
        enrollment: enrollCourseTable,
      })
      .from(courseTable)
      // The join now correctly filters by the current user, preventing duplicates
      .leftJoin(
        enrollCourseTable,
        and(
          eq(courseTable.cid, enrollCourseTable.courseId),
          eq(enrollCourseTable.userEmail, userEmail)
        )
      )
      .where(eq(courseTable.userId, userEmail))
      .orderBy(desc(courseTable.id));

    // The rest of your processing logic is correct
    const processedCourses = userCoursesAndProgress.map(({ course, enrollment }) => {
      // ... (safely parse courseJson and calculate progress)
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
      const completedCount = Array.isArray(completedChapters) ? completedChapters.length : 0;
      const progress = totalChapters > 0 ? Math.round((completedCount / totalChapters) * 100) : 0;

      return {
        ...course,
        courseJson: parsedCourseJson,
        isEnrolled: !!enrollment,
        progress: progress,
      };
    });

    return NextResponse.json(processedCourses);

  } catch (error) {
    console.error("Error fetching user courses:", error);
    return new NextResponse("Internal Server Error: " + error.message, { status: 500 });
  }
}

