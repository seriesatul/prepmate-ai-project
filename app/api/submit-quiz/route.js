import { NextResponse } from "next/server";
import { db } from '../../config/db';
import { courseTable, enrollCourseTable } from '../../config/schema';
import { eq, and } from 'drizzle-orm';
import { currentUser } from "@clerk/nextjs/server";

// --- THIS IS THE FIX ---
// A robust answer checker that ignores case and extra spaces.
const checkAnswer = (userAnswer = "", correctAnswer = "") => {
    // Ensure both inputs are treated as strings to prevent errors
    const formattedUserAnswer = String(userAnswer).trim().toLowerCase();
    const formattedCorrectAnswer = String(correctAnswer).trim().toLowerCase();
    return formattedUserAnswer === formattedCorrectAnswer;
};

export async function POST(req) {
  try {
    const user = await currentUser();
    if (!user || !user.primaryEmailAddress) {
      return new NextResponse("User not authenticated", { status: 401 });
    }
    const userEmail = user.primaryEmailAddress.emailAddress;

    const { courseId, chapterIndex, answers } = await req.json();

    if (!courseId || chapterIndex === undefined || !answers) {
      return new NextResponse("Bad Request: Missing required fields", { status: 400 });
    }

    // 1. Fetch the course to get the correct answers (unchanged)
    const courseResult = await db.select().from(courseTable).where(eq(courseTable.cid, courseId));
    if (courseResult.length === 0) return new NextResponse("Course not found", { status: 404 });
    
    let courseData = courseResult[0];
    if (typeof courseData.courseJson === 'string') courseData.courseJson = JSON.parse(courseData.courseJson);
    
    const chapter = courseData.courseJson.courseList[chapterIndex];
    if (!chapter || !chapter.quiz) return new NextResponse("Quiz not found", { status: 404 });

    // --- THIS IS THE FIX ---
    // 2. Score the quiz and build a detailed results array.
    let correctCount = 0;
    const totalQuestions = chapter.quiz.length;
    const detailedResults = chapter.quiz.map((question, index) => {
        const userAnswer = answers[index] || ""; // Default to empty string if no answer was provided
        const isCorrect = checkAnswer(userAnswer, question.answer);
        
        if (isCorrect) {
            correctCount++;
        }
        
        return {
            question: question.question,
            userAnswer: userAnswer,
            correctAnswer: question.answer,
            isCorrect: isCorrect,
        };
    });

    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passingScore = 80;
    const passed = score >= passingScore;

    // 3. If passed, update the user's enrollment record (unchanged, but now more reliable)
    if (passed) {
        const enrollment = await db.select().from(enrollCourseTable).where(and(
            eq(enrollCourseTable.courseId, courseId),
            eq(enrollCourseTable.userEmail, userEmail)
        ));
        if (enrollment.length > 0) {
            let passedChapters = enrollment[0].passedChapters || [];
            if (!Array.isArray(passedChapters)) passedChapters = [];

            if (!passedChapters.includes(chapter.title)) {
                passedChapters.push(chapter.title);
                await db.update(enrollCourseTable)
                    .set({ passedChapters: passedChapters })
                    .where(and(eq(enrollCourseTable.courseId, courseId), eq(enrollCourseTable.userEmail, userEmail)));
            }
        }
    }

    // 4. Return the full, detailed result object to the frontend.
    return NextResponse.json({
      passed,
      score,
      correctCount,
      totalQuestions,
      results: detailedResults, // The new, detailed array
    });

  } catch (error) {
    console.error("Error submitting quiz:", error);
    return new NextResponse("Internal Server Error: " + error.message, { status: 500 });
  }
}