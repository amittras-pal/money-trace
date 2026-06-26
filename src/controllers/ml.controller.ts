import routeHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import * as ort from "onnxruntime-node";
import fs from "node:fs";
import path from "node:path";
import { TypedRequest, TypedResponse } from "../types/requests";

// Initialize ONNX Session and classes map globally to reuse across requests
let session: ort.InferenceSession | null = null;
let classesMap: Record<string, string> = {};

const loadModel = async () => {
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

type PredictRequest = {
  title: string;
  description: string;
};

type PredictResponse = {
  categoryId: string;
  confidence: number;
};

/**
 * @desc    Predict category from expense title and description
 * @route   POST /api/ml/predict-category
 * @access  Private
 */
export const predictCategory = routeHandler(async (
  req: TypedRequest<{}, PredictRequest>,
  res: TypedResponse<PredictResponse>
) => {
  const { title, description } = req.body;

  if (!title && !description) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error("Please provide title or description");
  }

  if (!session) {
    await loadModel();
  }
  
  if (!session) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    throw new Error("ML Model is currently unavailable");
  }

  try {
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

    res.status(StatusCodes.OK).json({
      message: "Predicted category successfully",
      response: {
        categoryId,
        confidence
      }
    });
  } catch (error: any) {
    console.error("Prediction Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    throw new Error(error.message || "Failed to predict category");
  }
});
