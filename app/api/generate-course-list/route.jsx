// In: /app/api/generate-course-list/route.jsx

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { db } from '../../config/db'; // Use .js extension
import { courseTable,usersTable } from '../../config/schema'; // Use .js extension
import { currentUser } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";




export async function POST(req) {
  try {
    const body = await req.json();
    const user = await currentUser();

    if (!user || !user.primaryEmailAddress) {
      return new NextResponse("User not authenticated", { status: 401 });
    }
    const userEmail = user.primaryEmailAddress.emailAddress;

    const {
      topic,
      difficulty,
      courseDescription,
      courseChapters,
      includeVideo,
      courseCategory,
      learningObjectives = []
    } = body;

    const courseID = uuidv4();

    // Upsert the user
    await db.insert(usersTable).values({
        email: userEmail,
        name: user.fullName || 'New User',
        age: 99,
        SubscriptionId: 'default-sub'
    }).onConflictDoNothing();

    // AI Generation
    const modelName = "gemini-2.5-pro";
    const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const generationConfig = {
      response_mime_type: "application/json",
      temperature: 0.7,
    };
    const prompt = `Based on the following criteria, generate a course list.
    Topic: ${topic}
    Learning Objectives: ${learningObjectives.join(", ")}
    Difficulty: ${difficulty}

    . A comprehensive "courseList" array containing exactly ${courseChapters} chapters. Each object must have "title", "description", and "duration".
    
    IMPORTANT: Your response MUST be only the raw JSON text. Do not include any conversational text, explanations, or markdown formatting. The output should be a single JSON object with a "courseList" array. Each object must have "title", "description", and "duration" (in hours).
    
    Based on the course topic "${topic}", generate a "courseList" array and a creative "imageBannerPrompt". The image prompt should be for an AI image generator like Stable Diffusion, be visually descriptive, and suitable for a 16:9 banner. Example: "A vibrant abstract image representing learning and technology, with glowing neural networks and data streams, digital art".

    Your response MUST be a single raw JSON object with "courseList" and "imageBannerPrompt" as keys.`;

    const contents = [{ role: "user", parts: [{ text: prompt }] }];
    const results = await ai.getGenerativeModel({ model: modelName, generationConfig }).generateContent({ contents });

    // --- TYPO-FREE ROBUST JSON PARSING ---
    const fullResponseText = results.response.text();
   
    const startIndex = fullResponseText.indexOf('{');
    const endIndex = fullResponseText.lastIndexOf('}'); // Corrected variable

    if (startIndex === -1 || endIndex === -1) {
      console.error("Invalid AI Response:", fullResponseText);
      throw new Error("Could not find a valid JSON object in the AI response.");
    }
    const jsonString = fullResponseText.substring(startIndex, endIndex + 1);
    const generatedJson = JSON.parse(jsonString);

    const courseListJson = generatedJson.courseList;
    const imageBannerPrompt = generatedJson.imageBannerPrompt;

    if (!courseListJson || !imageBannerPrompt) {
        throw new Error("Gemini failed to generate course list or image prompt.");
    }
    
    console.log("🎨 Calling Hugging Face API to generate image...");
    const imageResponse = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
        },
        body: JSON.stringify({ inputs: imageBannerPrompt }),
      }
    );

    if (!imageResponse.ok) {
        const errorBody = await imageResponse.text();
        throw new Error(`Hugging Face API failed with status: ${imageResponse.statusText}. Body: ${errorBody}`);
    }

    // The response is the raw image data (a blob)
    const imageBlob = await imageResponse.blob();
    // We convert this blob into a Base64 Data URI string to save in our database
    const imageBuffer = Buffer.from(await imageBlob.arrayBuffer());
    const bannerImageUrl = `data:${imageBlob.type};base64,${imageBuffer.toString('base64')}`;

    console.log("🖼️ Hugging Face generated a Data URI successfully.");



    // Database insert
    const newCourse = await db.insert(courseTable).values({
      cid:courseID,
      courseName: topic,
      courseDescription: courseDescription,
      courseChapters: courseChapters,
      includeVideo: includeVideo,
      level: difficulty,
      courseCategory: courseCategory,
      courseJson: generatedJson,
      userId: userEmail,
      bannerImageUrl: bannerImageUrl, 
    }).returning({ returnedcourseID:courseTable.cid });

    return NextResponse.json({ courseID: newCourse[0]?.returnedcourseID });

  } catch (error) {
    console.error("Error in generate-course-list:", error);
    return new NextResponse("Internal Server Error: " + error.message, { status: 500 });
  }
}