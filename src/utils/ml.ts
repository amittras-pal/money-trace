import * as ort from "onnxruntime-node";
import fs from "node:fs";
import path from "node:path";

// Initialize ONNX Session and classes map globally to reuse across requests
let session: ort.InferenceSession | null = null;
let classesMap: Record<string, string> = {};

export const loadModel = async () => {
  if (session) return;
  const modelPath = path.join(__dirname, "..", "ml-models", "expense_classifier.onnx");
  const classesPath = path.join(__dirname, "..", "ml-models", "classes.json");

  try {
    if (fs.existsSync(modelPath) && fs.existsSync(classesPath)) {
      session = await ort.InferenceSession.create(modelPath);
      const classesData = fs.readFileSync(classesPath, "utf-8");
      classesMap = JSON.parse(classesData);
      console.log("ONNX model and classes loaded successfully.");
    } else {
      console.log("ONNX model files not found yet. They will be loaded when available.");
    }
  } catch (error) {
    console.error("Failed to load ONNX model or classes:", error);
  }
};

// Fire and forget
loadModel();

export const predictExpenseCategory = async (title: string, description: string) => {
  if (!session) {
    await loadModel();
  }
  
  if (!session) {
    throw new Error("ML Model is currently unavailable");
  }

  const titleTensor = new ort.Tensor("string", [title || ""], [1, 1]);
  const descTensor = new ort.Tensor("string", [description || ""], [1, 1]);

  const feeds: Record<string, ort.Tensor> = {
    title: titleTensor,
    description: descTensor
  };

  const results = await session.run(feeds);
  
  const labelOutputName = session.outputNames[0];
  const probOutputName = session.outputNames[1];
  
  const labelTensor = results[labelOutputName];
  const probTensor = results[probOutputName];
  
  const predictedClassId = labelTensor.data[0].toString();
  
  const categoryId = classesMap[predictedClassId];
  
  // Find the maximum probability score
  let confidence = 0;
  if (probTensor?.data) {
    const probabilities = probTensor.data as Float32Array | Float64Array;
    for (const probability of probabilities) {
      if (probability > confidence) {
        confidence = Number(probability);
      }
    }
  }

  return { categoryId, confidence };
};
