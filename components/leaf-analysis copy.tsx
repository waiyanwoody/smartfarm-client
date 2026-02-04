// "use client";

// import { Loader2 } from "lucide-react";
// import React, { useState } from "react";

// const PI_URL = process.env.NEXT_PUBLIC_PI_URL;

// const LeafAnalysis = () => {
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [analysisResult, setAnalysisResult] = useState<any>(null);
//   const [error, setError] = useState<string | null>(null);

//   const fetchAnalysis = async () => {
//     setIsAnalyzing(true);
//     setError(null);

//     try {
//       const response = await fetch(`${PI_URL}/capture-analyze`);
//       if (!response.ok) {
//         throw new Error("Failed to fetch analysis");
//       }

//       const data = await response.json();
//       setAnalysisResult(data);
//     } catch (err: any) {
//       setError(err.message || "An error occurred");
//     } finally {
//       setIsAnalyzing(false);
//     }
//   };

//   return (
//     <div className="space-y-4">
//       {isAnalyzing ? (
//         <div className="aspect-[4/3] rounded-xl overflow-hidden bg-foreground/5 relative">
//           <div className="absolute inset-0 flex items-center justify-center bg-background/40">
//             <div className="text-center">
//               <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
//               <p className="text-sm font-medium text-foreground mt-3">
//                 Analyzing with ML model...
//               </p>
//             </div>
//           </div>
//         </div>
//       ) : analysisResult ? (
//         <div className="space-y-4">
//           <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted relative">
//             <img
//               src={`${PI_URL}/farm-images/latest_leaf.jpg`}
//               alt="Analyzed leaf"
//               className="w-full h-full object-cover"
//             />
//             <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
//               <div className="text-center">
//                 <p className="text-sm font-medium text-foreground mt-3">
//                   Prediction: {analysisResult.prediction_label}
//                 </p>
//                 <p className="text-xs text-muted-foreground mt-1">
//                   Confidence: {(analysisResult.confidence * 100).toFixed(2)}%
//                 </p>
//                 <p className="text-xs text-muted-foreground mt-1">
//                   Healthy: {analysisResult.healthy ? "Yes" : "No"}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <button
//           onClick={fetchAnalysis}
//           className="px-4 py-2 bg-primary text-white rounded-md"
//         >
//           Analyze Leaf
//         </button>
//       )}
//       {error && <p className="text-red-500 text-sm">{error}</p>}
//     </div>
//   );
// };

// export default LeafAnalysis;