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

export default function InstagramCard({ passedURL }: { passedURL: string }) {
  const [result, setResult] = useState<any>("");
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const url = `https://instagram-downloader-download-instagram-reels-videos.p.rapidapi.com/post.php?url=${encodeURIComponent(
      passedURL
    )}`;

    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": "62defc1244mshf9c49fc4fc5efa7p1c6906jsn2acdb310be52",
        "x-rapidapi-host":
          "instagram-downloader-download-instagram-reels-videos.p.rapidapi.com",
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
  }, []);

  if (!hasMounted) return null;

  return (
    <div>
      <Card className="border-orange-500/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Instagram className="h-8 w-8 text-pink-500 mb-2" />
            <CardTitle>Instagram Content Found</CardTitle>
          </div>
          <CardDescription>Media information</CardDescription>
        </CardHeader>

        <CardContent>
          {result?.data && (
            <div className="mt-4">
              {/* <p>
                <strong>Author:</strong> {result.links[0].author}
              </p> */}
              {/* <p>
                <strong>Title:</strong> {result.data[0].thumbnail}
              </p> */}
              {/* <img
                src={result.data[0].thumbnail}
                alt="Preview"
                className="w-64"
              /> */}
              <video controls className="mt-2 w-64">
                <source src={result.data[0].download} type="video/mp4" />
              </video>
              {/* <p>
                <strong>Quality:</strong> {result.data[0].quality}
              </p> */}
              <Button
                className="w-full bg-orange-600 hover:bg-orange-700"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = result.data[0].download;
                  link.download = "instagram-video.mp4";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                Download Video
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
