"use client";

import type React from "react";

import { useState } from "react";
import {
  Download,
  ExternalLink,
  Youtube,
  Facebook,
  Instagram,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  const [url, setUrl] = useState("");
  const [platform, setPlatform] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const detectPlatform = (url: string) => {
    setIsLoading(true);

    // Simple URL detection logic
    setTimeout(() => {
      if (url.includes("youtube") || url.includes("youtu.be")) {
        setPlatform("youtube");
      } else if (url.includes("facebook") || url.includes("fb.com")) {
        setPlatform("facebook");
      } else if (url.includes("instagram") || url.includes("ig")) {
        setPlatform("instagram");
      } else if (url.includes("tiktok") || url.includes("tt")) {
        setPlatform("tiktok");
      } else {
        setPlatform("unknown");
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) detectPlatform(url);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "youtube":
        return <Youtube className="h-8 w-8 text-red-500" />;
      case "facebook":
        return <Facebook className="h-8 w-8 text-blue-600" />;
      case "instagram":
        return <Instagram className="h-8 w-8 text-pink-500" />;
      case "tiktok":
        return (
          <svg
            className="h-8 w-8"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"
              fill="currentColor"
            />
          </svg>
        );
      default:
        return <ExternalLink className="h-8 w-8 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Download className="h-6 w-6 text-orange-500" />
            <span className="text-xl font-bold">MediaGrab</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 container py-12 px-4 md:px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold tracking-tight">
              Universal Media Downloader
            </h1>
            <p className="text-muted-foreground">
              Download videos from YouTube, Facebook, Instagram, TikTok and more
            </p>
          </div>

          <Card className="border-orange-500/20">
            <CardHeader>
              <CardTitle>Enter Media URL</CardTitle>
              <CardDescription>
                Paste the link to the video or media you want to download
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1 focus-visible:ring-orange-500"
                  />
                  <Button
                    type="submit"
                    className="bg-orange-600 hover:bg-orange-700"
                    disabled={isLoading || !url}
                  >
                    {isLoading ? "Detecting..." : "Download"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {platform && (
            <Card className="border-orange-500/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  {getPlatformIcon(platform)}
                  <CardTitle>
                    {platform === "youtube" && "YouTube"}
                    {platform === "facebook" && "Facebook"}
                    {platform === "instagram" && "Instagram"}
                    {platform === "tiktok" && "TikTok"}
                    {platform === "unknown" && "Unknown Platform"}
                  </CardTitle>
                </div>
                <CardDescription>
                  {platform !== "unknown"
                    ? "Select your preferred download format and quality"
                    : "We couldn't identify the platform from this URL"}
                </CardDescription>
              </CardHeader>

              {platform !== "unknown" && (
                <CardContent>
                  <Tabs defaultValue="video" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-orange-950/20">
                      <TabsTrigger
                        value="video"
                        className="data-[state=active]:bg-orange-600"
                      >
                        Video
                      </TabsTrigger>
                      <TabsTrigger
                        value="audio"
                        className="data-[state=active]:bg-orange-600"
                      >
                        Audio Only
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="video" className="mt-4 space-y-4">
                      <RadioGroup defaultValue="720p">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1080p" id="1080p" />
                          <Label htmlFor="1080p">1080p HD (mp4)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="720p" id="720p" />
                          <Label htmlFor="720p">720p HD (mp4)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="480p" id="480p" />
                          <Label htmlFor="480p">480p (mp4)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="360p" id="360p" />
                          <Label htmlFor="360p">360p (mp4)</Label>
                        </div>
                      </RadioGroup>
                      <Button className="w-full bg-orange-600 hover:bg-orange-700">
                        Download Video
                      </Button>
                    </TabsContent>
                    <TabsContent value="audio" className="mt-4 space-y-4">
                      <RadioGroup defaultValue="mp3-high">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="mp3-high" id="mp3-high" />
                          <Label htmlFor="mp3-high">
                            High Quality (320kbps mp3)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="mp3-medium" id="mp3-medium" />
                          <Label htmlFor="mp3-medium">
                            Medium Quality (192kbps mp3)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="mp3-low" id="mp3-low" />
                          <Label htmlFor="mp3-low">
                            Low Quality (128kbps mp3)
                          </Label>
                        </div>
                      </RadioGroup>
                      <Button className="w-full bg-orange-600 hover:bg-orange-700">
                        Download Audio
                      </Button>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              )}
            </Card>
          )}

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-orange-500/20">
              <CardHeader className="pb-3">
                <Youtube className="h-8 w-8 text-red-500 mb-2" />
                <CardTitle>YouTube</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Download videos, playlists, and audio from YouTube in multiple
                  formats and qualities.
                </p>
              </CardContent>
            </Card>
            <Card className="border-orange-500/20">
              <CardHeader className="pb-3">
                <Facebook className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Facebook</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Save videos, reels, and stories from Facebook to your device
                  easily.
                </p>
              </CardContent>
            </Card>
            <Card className="border-orange-500/20">
              <CardHeader className="pb-3">
                <Instagram className="h-8 w-8 text-pink-500 mb-2" />
                <CardTitle>Instagram</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Download posts, reels, stories, and IGTV videos from
                  Instagram.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 md:px-6 md:flex-row">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            &copy; 2025 MediaGrab. For personal use only. Please respect
            copyright laws.
          </p>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              Terms
            </Button>
            <Button variant="ghost" size="sm">
              Privacy
            </Button>
            <Button variant="ghost" size="sm">
              Contact
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
