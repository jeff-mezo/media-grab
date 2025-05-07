//for twitter:
export async function POST(request: Request) {
    try {
      const { url } = await request.json();
      
      if (!url) {
        return Response.json(
          { success: false, error: "URL is required" },
          { status: 400 }
        );
      }
  
      // Check if URL is a Twitter/X URL
      if (!url.includes('twitter.com') && !url.includes('x.com')) {
        return Response.json(
          { success: false, error: "Invalid Twitter URL format" },
          { status: 400 }
        );
      }
  
      // RapidAPI configuration
      const rapidAPIKey = process.env.RAPID_API_KEY;
      const rapidAPIHost = 'twitter-video-and-image-downloader.p.rapidapi.com';
  
      if (!rapidAPIKey) {
        return Response.json(
          { success: false, error: "API key configuration missing" },
          { status: 500 }
        );
      }
  
      // Make request to RapidAPI using the correct endpoint and parameters
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': rapidAPIKey,
          'X-RapidAPI-Host': rapidAPIHost
        }
      };
  
      const apiUrl = `https://${rapidAPIHost}/twitter?url=${encodeURIComponent(url)}`;
      console.log("Calling RapidAPI at:", apiUrl);
      
      const response = await fetch(apiUrl, options);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("RapidAPI Error:", errorText);
        return Response.json(
          { success: false, error: `API Error: ${response.status}` },
          { status: response.status }
        );
      }
  
      const data = await response.json();
      
      // Ensure the response follows our expected format
      const formattedResponse = {
        success: true,
        version: "5",
        text: data.text || "",
        id: data.id || "",
        url: data.url || url,
        media: data.media || []
      };
      
      return Response.json(formattedResponse);
    } catch (error) {
      console.error("Server error:", error);
      return Response.json(
        { success: false, error: "Failed to process request" },
        { status: 500 }
      );
    }
  }