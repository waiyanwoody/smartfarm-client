import React, { useState } from "react";
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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageVersion, setImageVersion] = useState(0);


  const fetchAnalysis = async () => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);

    try {
      const res = await fetch("http://192.168.100.56:8000/capture-analyze");
      if (!res.ok) throw new Error("Failed to analyze leaf");

      const data = await res.json();

      setAnalysis({
        disease: data.prediction_label,
        confidence: data.confidence * 100,
        status: data.healthy ? "healthy" : "diseased",
        severity: data.healthy ? "low" : "moderate",
        affectedArea: data.healthy ? "None" : "Leaf surface",
      });

      // 👇 force image refresh
      setImageVersion(Date.now());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setAnalysis(null);
    setError(null);
    setImageVersion(0);
  };

  return (
    <Card className="border border-border bg-card overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg font-semibold">Leaf Analysis</span>

          {analysis && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetAnalysis}
              className="h-8 px-3 text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              New Scan
            </Button>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* INITIAL STATE */}
        {!analysis && !isAnalyzing && (
          <div className="space-y-5">
            <div className="aspect-[4/3] rounded-xl border-2 border-dashed bg-muted/30 flex flex-col items-center justify-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Leaf className="w-10 h-10 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-base font-medium">Ready to Analyze</p>
                <p className="text-sm text-muted-foreground">
                  Analyze the latest captured lettuce leaf
                </p>
              </div>
            </div>

            <Button
              onClick={fetchAnalysis}
              className="w-full h-12 text-base"
            >
              Analyze Leaf
            </Button>
          </div>
        )}

        {/* LOADING */}
        {isAnalyzing && (
          <div className="aspect-[4/3] rounded-xl bg-muted relative flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
              <p className="text-sm font-medium mt-3">
                Analyzing with ML model...
              </p>
            </div>
          </div>
        )}

        {/* RESULT */}
        {analysis && !isAnalyzing && (
          <div className="space-y-4">
            {/* Image */}
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted">
              <img
                src={`http://192.168.100.56:8000/farm-images/latest_leaf.jpg?v=${imageVersion}`}
                alt="Analyzed leaf"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Status Banner */}
            <div
              className={`p-4 rounded-xl border ${
                analysis.status === "healthy"
                  ? "bg-primary/5 border-primary/20"
                  : "bg-destructive/5 border-destructive/20"
              }`}
            >
              <div className="flex items-center gap-3">
                {analysis.status === "healthy" ? (
                  <CheckCircle2 className="w-10 h-10 text-primary" />
                ) : (
                  <AlertTriangle className="w-10 h-10 text-destructive" />
                )}

                <div>
                  <p
                    className={`text-lg font-semibold ${
                      analysis.status === "healthy"
                        ? "text-primary"
                        : "text-destructive"
                    }`}
                  >
                    {analysis.disease}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Confidence: {analysis.confidence.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground uppercase">Status</p>
                <p className="text-sm font-medium capitalize">
                  {analysis.status}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground uppercase">
                  Severity
                </p>
                <p className="text-sm font-medium capitalize">
                  {analysis.severity}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground uppercase">
                  Affected Area
                </p>
                <p className="text-sm font-medium">
                  {analysis.affectedArea}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground uppercase">Model</p>
                <p className="text-sm font-medium">ONNX v1.0</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <p className="text-sm text-destructive mt-3">{error}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default LeafAnalysis;
