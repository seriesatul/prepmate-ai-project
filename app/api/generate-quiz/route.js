import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { db } from '../../config/db';
import { courseTable } from '../../config/schema';
import { eq } from 'drizzle-orm';

export async function POST(req) {
  try {
    const { courseId, chapterTitle, chapterContent } = await req.json();

    if (!courseId || !chapterTitle || !chapterContent) {
      return new NextResponse("Bad Request: Missing required fields", { status: 400 });
    }

    // --- AI Quiz Generation ---
    const modelName = "gemini-2.5-pro";
    const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const generationConfig = { response_mime_type: "application/json" };
    
    const prompt = `
    Based on the following chapter content:
    ---
    ${chapterContent}
    ---
    Generate a quiz with 3 to 5 questions to test understanding of the key concepts.
    Include a mix of multiple-choice and short-answer questions.
    
    Format the output as a single JSON object with a "quiz" key. The value should be an array of question objects.
    Each question object must have:
    - "question": The question text (string).
    - "type": "multiple-choice" 
    - "options": An array of strings for multiple-choice, or null .
    - "answer": The correct answer (string).

    Example:
    {
      "quiz": [
        {
          "question": "Which command is used to build a Docker image?",
          "type": "multiple-choice",
          "options": ["docker run", "docker build", "docker push", "docker pull"],
          "answer": "docker build"
        }
      ]
    }
    `;

    const result = await ai.getGenerativeModel({ model: modelName, generationConfig }).generateContent(prompt);
    const generatedQuizJson = JSON.parse(result.response.text());
    
    // --- Update the Database with the new quiz ---
    const existingCourse = await db.select().from(courseTable).where(eq(courseTable.cid, courseId));
    if (existingCourse.length === 0) return new NextResponse("Course not found", { status: 404 });

    let courseData = existingCourse[0];
    if (typeof courseData.courseJson === 'string') courseData.courseJson = JSON.parse(courseData.courseJson);
    
    const updatedCourseList = courseData.courseJson.courseList.map(chapter => {
      if (chapter.title === chapterTitle) {
        return { ...chapter, quiz: generatedQuizJson.quiz }; // Add the quiz to the chapter
      }
      return chapter;
    });

    const updatedCourseJson = { ...courseData.courseJson, courseList: updatedCourseList };
    await db.update(courseTable).set({ courseJson: updatedCourseJson }).where(eq(courseTable.cid, courseId));

    return NextResponse.json({ quiz: generatedQuizJson.quiz });

  } catch (error) {
    console.error("Error generating quiz:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}