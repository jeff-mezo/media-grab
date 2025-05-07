// app/api/download-youtube/route.ts
import { fetchYouTubeVideoData } from "@/lib/youtube-methods";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const passedURL = searchParams.get("passedURL");

  if (!passedURL) {
    return Response.json({ error: "Missing passedURL parameter" }, { status: 400 });
  }

  try {
    const data = await fetchYouTubeVideoData(passedURL);
    
    // Check if the API response contains error
    if (!data || data.errorId !== "Success") {
      throw new Error(data?.errorId || "Invalid response from YouTube API");
    }
    
    // Format the response based on the actual RapidAPI structure
    const formattedResponse = {
      title: data.title || "Untitled Video",
      thumbnail: data.thumbnails && data.thumbnails.length > 0 ? data.thumbnails[0].url : null,
      formats: {
        video: [],
        audio: []
      }
    };
    
    // Process video formats
    if (data.videos && data.videos.status && data.videos.items && Array.isArray(data.videos.items)) {
      formattedResponse.formats.video = data.videos.items.map(item => ({
        quality: item.quality || "unknown",
        url: item.url,
        mimeType: item.mimeType || "video/mp4",
        size: item.size || "unknown",
        container: item.extension || "mp4"
      }));
    }
    
    // Process audio formats
    if (data.audios && data.audios.status && data.audios.items && Array.isArray(data.audios.items)) {
      formattedResponse.formats.audio = data.audios.items.map(item => ({
        quality: item.isDrc ? "High Quality" : "Standard Quality",
        url: item.url,
        mimeType: item.mimeType || "audio/mp4",
        size: item.size || "unknown",
        container: item.extension || "m4a"
      }));
    }
    
    // Check if we have any valid formats to return
    if (formattedResponse.formats.video.length === 0 && formattedResponse.formats.audio.length === 0) {
      throw new Error("No downloadable formats found for this video");
    }
    
    return Response.json(formattedResponse);
  } catch (error: any) {
    console.error("YouTube API error:", error.message);
    return Response.json({ error: error.message || "Failed to fetch YouTube info" }, { status: 500 });
  }
}


