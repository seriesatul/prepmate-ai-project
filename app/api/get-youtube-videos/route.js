import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const searchQuery = searchParams.get('q');

    if (!searchQuery) {
      return new NextResponse("Bad Request: Search query 'q' is required", { status: 400 });
    }

    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
    
    // Construct the URL for the YouTube API search endpoint
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&maxResults=5&key=${YOUTUBE_API_KEY}`;
    
    console.log("Fetching from YouTube API:", url);

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
        // If Google's API returns an error, forward it
        console.error("YouTube API Error:", data);
        throw new Error(data.error?.message || 'Failed to fetch from YouTube API');
    }

    // Extract the video ID and title from the response
    const videos = data.items.map(item => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high.url,
    }));

    return NextResponse.json(videos);

  } catch (error) {
    console.error("Error in get-youtube-videos route:", error);
    return new NextResponse("Internal Server Error: " + error.message, { status: 500 });
  }
}