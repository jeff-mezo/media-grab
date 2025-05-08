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
  const [result, setResult] = useState<any>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const url = `https://free-facebook-downloader.p.rapidapi.com/external-api/facebook-video-downloader?url=${encodeURIComponent(
      passedURL
    )}`;

    // const url = 'https://free-facebook-downloader.p.rapidapi.com/external-api/facebook-video-downloader?url=https%3A%2F%2Fwww.facebook.com%2Fwatch%3Fv%3D1320041659349823';
    const options = {
      method: "POST",
      headers: {
        "x-rapidapi-key": "62defc1244mshf9c49fc4fc5efa7p1c6906jsn2acdb310be52",
        "x-rapidapi-host": "free-facebook-downloader.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      body: {
        key1: "value",
        key2: "value",
      },
    };

    fetch(url, options)
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setResult(response);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [passedURL]);

  const [quality, setQuality] = useState<string>("Download Low Quality");

  if (!hasMounted) return null;

  return (
    <div className="mt-4">
      <Card className="border-orange-500/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Facebook className="h-8 w-8 text-blue-600" />
            <CardTitle>Facebook Content Found</CardTitle>
          </div>
          <CardDescription>Media information</CardDescription>
        </CardHeader>

        <CardContent>
          {result?.success ? (
            <div>
              <p className="font-semibold">Title: {result.title}</p>
              <video
                src={result.links["Download Low Quality"]}
                className="w-full mt-3 rounded"
                controls
                muted
              />

              {/* <div className="flex flex-col gap-3 mt-3">
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = result.links["Download Low Quality"];
                    link.download = "facebook-low-quality.mp4";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  Download Low Quality
                </button>
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded"
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = result.links["Download High Quality"];
                    link.download = "facebook-high-quality.mp4";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  Download High Quality
                </button> */}

              <RadioGroup
                value={quality}
                onValueChange={setQuality}
                className="my-5"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Download High Quality" id="high" />
                  <Label htmlFor="high">Download High Quality</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Download Low Quality" id="low" />
                  <Label htmlFor="low">Download Low Quality</Label>
                </div>
              </RadioGroup>

              <Button
                className="w-full bg-orange-600 hover:bg-orange-700"
                onClick={() => {
                  const selectedUrl = result.links[quality];
                  if (selectedUrl) {
                    const a = document.createElement("a");
                    a.href = selectedUrl;
                    a.download = "video.mp4";
                    a.click();
                  }
                }}
              >
                Download Video
              </Button>
            </div>
          ) : (
            <p className="text-muted-foreground">Fetching media...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
