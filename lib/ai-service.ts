import { CropDoctorResult } from "@/types";
import { saveStoredDiagnosis } from "@/lib/mock-data";

export const ANALYSIS_STEPS = [
  "Uploading image...",
  "Analyzing crop...",
  "Detecting possible disease...",
  "Evaluating severity...",
  "Generating recommendations...",
];

export const DEMO_AI_RESULT: CropDoctorResult = {
  id: "diag-rust-01",
  timestamp: "Just now",
  crop: "Wheat",
  healthScore: 72,
  disease: "Leaf Rust",
  scientificName: "Puccinia triticina",
  severity: "Moderate",
  confidence: 94,
  explanation:
    "AI analysis indicates possible leaf rust symptoms. The detected pattern is consistent with a moderate level of infection. Monitor nearby plants and follow locally approved agricultural guidance.",
  disclaimer:
    "Prototype AI result. This is not a professional agricultural diagnosis. Follow local agricultural guidance before treatment.",
  recommendations: [
    "Follow locally approved fungicide guidance.",
    "Monitor nearby plants for similar symptoms.",
    "Avoid excessive irrigation.",
    "Remove severely affected plant material where appropriate.",
    "Recheck crop health in 3–5 days.",
  ],
  healthBreakdown: {
    leafHealth: 72,
    soilCondition: 80,
    waterStress: 65,
    diseaseRisk: 58,
    weatherRisk: 30,
  },
  imageUrl:
    "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80",
  affectedAreaPercentage: 18,
  isFallback: true,
  source: "fallback",
};

/**
 * AI Crop Doctor Service
 * Connects to server-side AI Vision endpoint (/api/crop-diagnosis)
 * With realistic progressive feedback and fallback safety.
 */
export async function analyzeCropImage(
  imageSource: File | string,
  onProgress?: (step: string, percent: number) => void,
  cropHint?: string
): Promise<CropDoctorResult> {
  let imageBase64: string;

  if (typeof imageSource === "string") {
    imageBase64 = imageSource;
  } else if (typeof window !== "undefined" && imageSource instanceof File) {
    imageBase64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(imageSource);
    });
  } else {
    imageBase64 = DEMO_AI_RESULT.imageUrl || "";
  }

  const steps = ANALYSIS_STEPS;
  if (onProgress) onProgress(steps[0], 20);
  await new Promise((resolve) => setTimeout(resolve, 200));

  if (onProgress) onProgress(steps[1], 40);

  let finalResult: CropDoctorResult;

  try {
    let apiData: CropDoctorResult | null = null;

    if (typeof window !== "undefined") {
      const res = await fetch("/api/crop-diagnosis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: imageBase64,
          cropHint,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        apiData = json.result;
      }
    }

    if (onProgress) onProgress(steps[2], 65);
    await new Promise((resolve) => setTimeout(resolve, 250));

    if (onProgress) onProgress(steps[3], 85);
    await new Promise((resolve) => setTimeout(resolve, 200));

    if (onProgress) onProgress(steps[4], 100);

    if (apiData) {
      finalResult = apiData;
    } else {
      finalResult = {
        ...DEMO_AI_RESULT,
        id: `diag-${Date.now()}`,
        timestamp: "Just now",
        imageUrl: imageBase64,
        isFallback: true,
        source: "fallback",
      };
    }
  } catch (err) {
    console.warn("AI Crop diagnosis request error, using fallback:", err);
    if (onProgress) onProgress(steps[4], 100);
    finalResult = {
      ...DEMO_AI_RESULT,
      id: `diag-${Date.now()}`,
      timestamp: "Just now",
      imageUrl: imageBase64,
      isFallback: true,
      source: "fallback",
    };
  }

  saveStoredDiagnosis(finalResult);
  return finalResult;
}

/**
 * Preset sample crop images for immediate one-click testing
 */
export const SAMPLE_CROP_IMAGES = [
  {
    id: "sample-rust",
    name: "Wheat — Leaf Rust Pustules",
    url: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80",
    expectedCrop: "Wheat",
    status: "Moderate Infection",
  },
  {
    id: "sample-blight",
    name: "Tomato — Foliar Early Blight",
    url: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600&q=80",
    expectedCrop: "Tomato",
    status: "High Infection",
  },
  {
    id: "sample-healthy",
    name: "Wheat — Healthy Flag Leaf",
    url: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80",
    expectedCrop: "Wheat",
    status: "Healthy",
  },
];
