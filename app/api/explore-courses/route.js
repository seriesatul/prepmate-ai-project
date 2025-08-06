import { NextResponse } from "next/server";
import { db } from '../../config/db';
import { courseTable } from '../../config/schema';
import { eq, isNotNull, sql } from 'drizzle-orm';
import { currentUser } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET() {
  try {
    const user = await currentUser();
    const userName = user?.firstName || 'the user';
    console.log("1. Starting 'explore-courses' route...");

    const publicCourses = await db.select()
      .from(courseTable)
      .where(eq(courseTable.isPublished, true))
      .orderBy(sql`RANDOM()`)
      .limit(20);

    console.log(`2. Found ${publicCourses.length} public courses in the database.`);

    if (publicCourses.length === 0) {
      console.log("   -> No public courses found. Returning empty state.");
      return NextResponse.json({
        recommendationTitle: "Explore Courses",
        recommendationReason: "There are no public courses available yet. Be the first to create and publish one!",
        recommendedCourses: []
      });
    }

    const courseCatalog = publicCourses.map(course => ({
      // ... (your mapping logic)
    }));

    console.log("3. Prepared course catalog for AI. Sending to Gemini...");
    const modelName = "gemini-2.5-pro";
    const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const generationConfig = { response_mime_type: "application/json" };
    
    const prompt = `...`; // Your prompt
    
    const result = await ai.getGenerativeModel({ model: modelName, generationConfig }).generateContent(prompt);
    const aiResponseText = await result.response.text();
    
    console.log("4. Received raw response from Gemini:", aiResponseText);
    
    const aiResponse = JSON.parse(aiResponseText);
    console.log("5. Parsed Gemini response successfully.");

    const recommendedCids = new Set(aiResponse.recommendedCourses);
    const finalCourses = publicCourses.filter(course => recommendedCids.has(course.cid));
    console.log(`6. AI recommended ${finalCourses.length} courses. Filtering complete.`);

    return NextResponse.json({
      recommendationTitle: aiResponse.recommendationTitle,
      recommendationReason: aiResponse.recommendationReason,
      recommendedCourses: finalCourses,
    });

  } catch (error) {
    console.error("❌ ERROR in 'explore-courses' route:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}