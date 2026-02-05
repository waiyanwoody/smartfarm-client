"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Camera,
  Leaf,
} from "lucide-react";

const LeafAnalysis = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [ready, setReady] = useState(false);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const PI_URL = process.env.NEXT_PUBLIC_PI_URL;

  // ---------------------------
  // START CAMERA (SAFE)
  // ---------------------------
  const startCamera = async () => {
    setError(null);
    setReady(false);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      setStream(mediaStream);
    } catch {
      setError("Camera permission denied");
    }
  };

  // ---------------------------
  // ATTACH STREAM AFTER RENDER
  // ---------------------------
  useEffect(() => {
    if (!stream || !videoRef.current) return;

    const video = videoRef.current;
    video.srcObject = stream;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;

    const onReady = () => {
      video.play();
      setReady(true);
    };

    video.addEventListener("loadeddata", onReady);
    return () => video.removeEventListener("loadeddata", onReady);
  }, [stream]);

  // ---------------------------
  // STOP CAMERA
  // ---------------------------
  const stopCamera = () => {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    setReady(false);
  };

  // ---------------------------
  // CAPTURE PHOTO (SAFE)
  // ---------------------------
  const capture = () => {
    if (!videoRef.current || !canvasRef.current || !ready) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;
      setImageBlob(blob);
      setPreview(URL.createObjectURL(blob));
      stopCamera();
    }, "image/jpeg", 0.95);
  };

  // ---------------------------
  // MANUAL FILE UPLOAD
  // ---------------------------
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageBlob(file);
    setPreview(URL.createObjectURL(file));
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // ---------------------------
  // ANALYZE
  // ---------------------------
  const analyze = async () => {
    if (!imageBlob) return;

    setLoading(true);
    setError(null);

    const fd = new FormData();
    fd.append("file", imageBlob, "leaf.jpg");

    try {
      const res = await fetch(`${PI_URL}/upload-analyze`, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) throw new Error("Analysis failed");

      const data = await res.json();
      setAnalysis({
        disease: data.prediction_label,
        confidence: data.confidence * 100,
        healthy: data.healthy,
      });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    stopCamera();
    setPreview(null);
    setImageBlob(null);
    setAnalysis(null);
    setError(null);
  };

  useEffect(() => () => stopCamera(), []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Leaf Analysis
          {(preview || analysis) && (
            <Button variant="ghost" size="sm" onClick={reset}>
              <RefreshCw className="w-4 h-4 mr-1" />
              New
            </Button>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {!stream && !preview && !analysis && (
          <div className="text-center space-y-4">
            <div className="w-full h-96 flex items-center justify-center border rounded-xl bg-muted">
              <Leaf className="w-16 h-16 text-muted-foreground" />
            </div>
            <Button className="w-full h-12" onClick={startCamera}>
              <Camera className="w-4 h-4 mr-2" />
              Open Camera
            </Button>
            <Button className="w-full h-12 mt-2" onClick={triggerFileUpload}>
              Upload Image
            </Button>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>
        )}

        {stream && (
          <div className="space-y-3">
            <video
              ref={videoRef}
              className="max-w-3xl  mx-auto h-96 rounded-xl object-cover bg-black"
              style={{ transform: "scaleX(-1)" }}
            />
            <Button
              className="w-full h-12"
              onClick={capture}
              disabled={!ready}
            >
              {ready ? "Take Photo" : "Loading Camera…"}
            </Button>
          </div>
        )}

        {preview && !analysis && !loading && (
          <div className="space-y-3">
            <img
              src={preview}
              className="w-full h-64 rounded-xl object-cover"
            />
            <Button className="w-full h-12" onClick={analyze}>
              Analyze Leaf
            </Button>
          </div>
        )}

        {loading && (
          <div className="h-full flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="mt-2 text-sm">Analyzing…</p>
          </div>
        )}

        {analysis && (
          <div className="space-y-3">
            <img src={preview!} className="w-full h-full rounded-xl" />
            <div
              className={`p-4 rounded-xl border ${
                analysis.healthy
                  ? "bg-green-50 border-green-300"
                  : "bg-red-50 border-red-300"
              }`}
            >
              <div className="flex items-center gap-3">
                {analysis.healthy ? (
                  <CheckCircle2 className="text-green-600" />
                ) : (
                  <AlertTriangle className="text-red-600" />
                )}
                <div>
                  <p className="font-semibold">{analysis.disease}</p>
                  <p className="text-sm">
                    Confidence: {analysis.confidence.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <canvas ref={canvasRef} hidden />
      </CardContent>
    </Card>
  );
};

export default LeafAnalysis;