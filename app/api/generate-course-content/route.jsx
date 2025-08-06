import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { db } from '../../config/db';
import { courseTable } from '../../config/schema';
import { eq } from 'drizzle-orm';

export async function POST(req) {
  try {
    const { courseId, chapterTitle } = await req.json();

    if (!courseId || !chapterTitle) {
      return new NextResponse("Bad Request: Missing courseId or chapterTitle", { status: 400 });
    }

    // --- 1. AI Content Generation ---
    const modelName = "gemini-2.5-pro";
    const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // This prompt is focused on generating detailed content for a single chapter
    const prompt = `
    You are a professional course content creator.
    Based on the following chapter title: "${chapterTitle}", generate detailed content for this chapter.
    The content should be comprehensive, well-structured, and easy to understand.
    Include key concepts, examples, and practical applications where relevant.
    Format the output as a single block of Markdown text. Use headings, lists, and code blocks where appropriate.
    Do NOT include the chapter title itself in the output, only the body content.
    `;

    const result = await ai.getGenerativeModel({ model: modelName }).generateContent(prompt);
    const generatedContent = await result.response.text();

    if (!generatedContent) {
        throw new Error("AI failed to generate content.");
    }
    
    // --- 2. Update the Database ---
    // First, fetch the existing course data
    const existingCourse = await db.select()
      .from(courseTable)
      .where(eq(courseTable.cid, courseId));

    if (existingCourse.length === 0) {
      return new NextResponse("Course not found", { status: 404 });
    }

    let courseData = existingCourse[0];
    
    // Ensure courseJson is parsed if it's a string
    if (typeof courseData.courseJson === 'string') {
        courseData.courseJson = JSON.parse(courseData.courseJson);
    }
    
    // Find the specific chapter in the courseList and add the new content
    const updatedCourseList = courseData.courseJson.courseList.map(chapter => {
      if (chapter.title === chapterTitle) {
        return { ...chapter, content: generatedContent }; // Add the 'content' property
      }
      return chapter;
    });

    // Update the courseJson object with the modified courseList
    const updatedCourseJson = { ...courseData.courseJson, courseList: updatedCourseList };

    // Save the updated object back to the database
    await db.update(courseTable)
      .set({ courseJson: updatedCourseJson })
      .where(eq(courseTable.cid, courseId));

    // Return the newly generated content to the frontend
    return NextResponse.json({ content: generatedContent });

  } catch (error) {
    console.error("Error generating course content:", error);
    return new NextResponse("Internal Server Error: " + error.message, { status: 500 });
  }
}