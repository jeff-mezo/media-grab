"use client";

import { useEffect, useState } from "react";
import { Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Twitter } from "lucide-react";

interface TweetMedia {
  type: string;
  url: string;
  thumbnail: string;
  width: number;
  height: number;
}

interface TweetData {
  success: boolean;
  version: string;
  text: string;
  id: string;
  url: string;
  media: TweetMedia[];
}

export default function TwitterCard({ passedURL }: { passedURL: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [tweetData, setTweetData] = useState<TweetData | null>(null);
  const [selectedQuality, setSelectedQuality] = useState("high");

  useEffect(() => {
    if (passedURL) {
      fetchTweetData(passedURL);
    }
  }, [passedURL]);

  const fetchTweetData = async (url: string) => {
    try {
      setIsLoading(true);
      setError("");

      // Call our internal API endpoint that will communicate with RapidAPI
      const res = await fetch("/api/fetch-twitter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Error: ${res.status}`);
      }

      const data = await res.json();

      // Check for error response or missing media
      if (!data.success || !data.media || data.media.length === 0) {
        throw new Error(
          data.error || "No media found in tweet or failed to fetch tweet data"
        );
      }

      console.log("Tweet data received:", data);
      setTweetData(data);
    } catch (error) {
      console.error("Error fetching tweet data:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch tweet information"
      );
      setTweetData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!tweetData?.media?.length) {
      setError("No media available for download");
      return;
    }

    // Find video media - typically the first one with type "video"
    const videoMedia = tweetData.media.find((media) => media.type === "video");

    if (!videoMedia?.url) {
      setError("No video URL available for this tweet");
      return;
    }

    console.log("Downloading video:", videoMedia.url);

    // Create a download link
    const a = document.createElement("a");
    a.href = videoMedia.url;
    a.download = `twitter-video-${tweetData.id || "download"}.mp4`;
    a.target = "_blank"; // Open in new tab
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Twitter icon SVG
  // const TwitterIcon = () => (
  //   <svg
  //     className="h-8 w-8 text-blue-400"
  //     viewBox="0 0 24 24"
  //     fill="none"
  //     xmlns="http://www.w3.org/2000/svg"
  //   >
  //     <path
  //       d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"
  //       fill="currentColor"
  //     />
  //   </svg>
  // );

  if (isLoading) {
    return (
      <Card className="border-orange-500/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Twitter className="text-blue-600" />
            <CardTitle>Loading Twitter Content</CardTitle>
          </div>
          <CardDescription>
            Please wait while we fetch the tweet information...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-orange-500/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            {/* <TwitterIcon /> */}
            <CardTitle>Error</CardTitle>
          </div>
          <CardDescription className="text-red-500">{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => fetchTweetData(passedURL)}
            className="w-full bg-orange-600 hover:bg-orange-700"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!tweetData) {
    return (
      <Card className="border-orange-500/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Twitter className="text-blue-600" />
            <CardTitle>Twitter Content</CardTitle>
          </div>
          <CardDescription>
            Enter a valid Twitter/X URL to download content
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const hasVideo = tweetData.media.some((media) => media.type === "video");
  const videoMedia = tweetData.media.find((media) => media.type === "video");

  return (
    <Card className="border-orange-500/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Twitter className="text-blue-600" />
          <CardTitle>Twitter Content Found</CardTitle>
        </div>
        <CardDescription>
          {tweetData.text.length > 100
            ? `${tweetData.text.substring(0, 100)}...`
            : tweetData.text}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {videoMedia?.thumbnail && (
          <div className="mb-4">
            <img
              src={videoMedia.thumbnail}
              alt="Tweet media thumbnail"
              className="w-full h-auto rounded-md"
            />
          </div>
        )}

        {hasVideo ? (
          <Tabs defaultValue="video" className="w-full">
            <TabsList className="grid w-full grid-cols-1 bg-orange-950/20">
              <TabsTrigger
                value="video"
                className="data-[state=active]:bg-orange-600"
              >
                Video
              </TabsTrigger>
            </TabsList>
            <TabsContent value="video" className="mt-4 space-y-4">
              <RadioGroup
                value={selectedQuality}
                onValueChange={setSelectedQuality}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="high" />
                  <Label htmlFor="high">High Quality</Label>
                </div>
              </RadioGroup>
              <Button
                onClick={handleDownload}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Video
              </Button>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground">
              No video content found in this tweet
            </p>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-border">
          <a
            href={tweetData.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-500 flex items-center justify-center"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View Original Tweet
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
