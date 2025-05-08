// lib/youtube-methods.ts
export async function fetchYouTubeVideoData(passedURL: string) {
    // Extract video ID from the URL
    const videoId = extractYouTubeVideoId(passedURL);
    
    if (!videoId) {
      throw new Error("Invalid YouTube URL: Could not extract video ID");
    }
  
    console.log("Extracted video ID:", videoId);
  
    // Build the API URL with the videoId
    const apiUrl = `https://youtube-media-downloader.p.rapidapi.com/v2/video/details?videoId=${videoId}`;
  
    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY || "",
          "X-RapidAPI-Host": "youtube-media-downloader.p.rapidapi.com"
        },
        next: { revalidate: 60 } // Cache for 60 seconds
      });
  
      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        console.error(`API Error: ${response.status} ${response.statusText}`, errorText);
        
        if (response.status === 401 || response.status === 403) {
          throw new Error("API key missing or invalid. Please check your RapidAPI key configuration.");
        } 
        else if (response.status === 429) {
          throw new Error("API rate limit exceeded. Please try again later.");
        }
        else {
          throw new Error(`Failed to fetch video data: ${response.status}`);
        }
      }
  
      const data = await response.json();
      console.log("API response received for video ID:", videoId);
      
      // Validate the response
      if (!data) {
        throw new Error("Empty response from YouTube API");
      }
      
      // Check if the API returned an error message
      if (data.errorId && data.errorId !== "Success") {
        throw new Error(data.errorId || "Unknown error from YouTube API");
      }
      
      return data;
    } catch (error: any) {
      console.error("Error in fetchYouTubeVideoData:", error);
      throw error;
    }
  }
  
  // Helper function to extract video ID from YouTube URL
  export function extractYouTubeVideoId(url: string): string | null {
    // Handle various YouTube URL formats
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/i,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/i,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([^?]+)/i,
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/i,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^?]+)/i
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  }