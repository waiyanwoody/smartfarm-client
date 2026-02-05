"use client";

import React, { useRef, useState } from "react";
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
  Leaf,
} from "lucide-react";

const LeafAnalysis = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const pi_url = process.env.NEXT_PUBLIC_PI_URL;

  // Open phone camera
  const openCamera = () => {
    fileInputRef.current?.click();
  };

  // Handle captured image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setImagePreview(URL.createObjectURL(selected));
  };

  // Upload + analyze
  const uploadAndAnalyze = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${pi_url}/upload-analyze`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Analysis failed");

      const data = await res.json();

      setAnalysis({
        disease: data.prediction_label,
        confidence: data.confidence * 100,
        healthy: data.healthy,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setAnalysis(null);
    setError(null);
    setImagePreview(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Leaf Analysis
          {analysis && (
            <Button variant="ghost" size="sm" onClick={reset}>
              <RefreshCw className="w-4 h-4 mr-1" />
              New
            </Button>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Hidden Camera Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          hidden
        />

        {/* Initial */}
        {!file && !isAnalyzing && !analysis && (
          <div className="text-center space-y-4">
            <div className="h-48 flex items-center justify-center border rounded-xl bg-muted">
              <Leaf className="w-16 h-16 text-muted-foreground" />
            </div>
            <Button className="w-full h-12" onClick={openCamera}>
              Capture Leaf
            </Button>
          </div>
        )}

        {/* Preview */}
        {file && !analysis && !isAnalyzing && (
          <div className="space-y-3">
            <img
              src={imagePreview!}
              className="rounded-xl w-full h-64 object-cover"
              alt="preview"
            />
            <Button className="w-full h-12" onClick={uploadAndAnalyze}>
              Analyze Leaf
            </Button>
          </div>
        )}

        {/* Loading */}
        {isAnalyzing && (
          <div className="h-48 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="mt-2 text-sm">Analyzing…</p>
          </div>
        )}

        {/* Result */}
        {analysis && (
          <div className="space-y-3">
            <img
              src={imagePreview!}
              className="rounded-xl w-full h-64 object-cover"
              alt="result"
            />

            <div
              className={`p-4 rounded-xl border ${analysis.healthy
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
                  {/* <p className="font-semibold">{analysis.disease}</p> */}
                  <p className="font-semibold">
                    {analysis.healthy ? "Leaf is Healthy" : "Leaf is Unhealthy"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && <p className="text-red-600 text-sm">{error}</p>}
      </CardContent>
    </Card>
  );
};

export default LeafAnalysis;