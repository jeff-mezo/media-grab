"use client";

import type React from "react";

import { useEffect, useState } from "react";
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

export default function FacebookCard({ passedURL }: { passedURL: string }) {

  const [quality, setQuality] = useState("Low");
  const [link, setLink] = useState("");
  const [title, setTitle] = useState("");

  const fetchLinks = async (quality: string) => {
    const FacebookAPIBaseURL = "http://127.0.0.1:5000/get_video_links?url=";
    try {
      const res = await fetch(FacebookAPIBaseURL + passedURL);
      const data = await res.json();

      let downloadLink = '';
      if (quality === "Low") {
        downloadLink = data["links"]["Download Low Quality"];
      } else if (quality === "High") {
        downloadLink = data["links"]["Download High Quality"];
      }

      console.log(data)
      const title = data["title"] || 'video';

      // Trigger download
      const anchor = document.createElement('a');
      anchor.href = downloadLink;
      anchor.download = `${title}.mp4`; // optional: this only works for same-origin or CORS-enabled links
      anchor.style.display = 'none';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

    } catch (error) {
      console.error('Download failed:', error);
    }
  }

  return (
    <Card className="border-orange-500/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Facebook className="h-8 w-8 text-blue-600" />
          <CardTitle>
            Facebook
          </CardTitle>
        </div>
        <CardDescription>
          Select your preferred download format and quality
        </CardDescription>
        <CardDescription>
          {link}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="video" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-orange-950/20">
            <TabsTrigger
              value="video"
              className="data-[state=active]:bg-orange-600"
            >
              Video
            </TabsTrigger>
          </TabsList>
          <TabsContent value="video" className="mt-4 space-y-4">
            <RadioGroup defaultValue={quality} onValueChange={(value) => setQuality(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="High" id="High" />
                <Label htmlFor="High">High</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Low" id="Low" />
                <Label htmlFor="Low">Low</Label>
              </div>
            </RadioGroup>
            <Button className="w-full bg-orange-600 hover:bg-orange-700" onClick={() => fetchLinks(quality)}>
              Download Video
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}