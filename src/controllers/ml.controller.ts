import routeHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { TypedRequest, TypedResponse } from "../types/requests";
import { PredictRequest, PredictResponse } from "../types/ml";
import { predictExpenseCategory } from "../utils/ml";

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

  try {
    const { categoryId, confidence } = await predictExpenseCategory(title, description);

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
