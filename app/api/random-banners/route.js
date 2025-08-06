import { NextResponse } from "next/server";
import { db } from '../../config/db';
import { courseTable } from '../../config/schema';
import { sql, isNotNull } from 'drizzle-orm';

export async function GET() {
  try {
    // This Drizzle query fetches 6 random rows from the 'courses' table
    // where the bannerImageUrl is not null.
    // ORDER BY RANDOM() is a standard SQL function for this.
    const randomBanners = await db.select({
        bannerImageUrl: courseTable.bannerImageUrl,
        courseName: courseTable.courseName, // Also good to fetch the name for alt text
      })
      .from(courseTable)
      .where(isNotNull(courseTable.bannerImageUrl)) // Ensure we only get courses with images
      .orderBy(sql`RANDOM()`)
      .limit(6);

    // Drizzle with neon-http might return empty strings instead of null.
    // Let's filter those out as well.
    const validBanners = randomBanners.filter(b => b.bannerImageUrl && b.bannerImageUrl.startsWith('data:image'));

    return NextResponse.json(validBanners);

  } catch (error) {
    console.error("Error fetching random banners:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}