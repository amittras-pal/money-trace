export type PredictRequest = {
  title: string;
  description: string;
};

export type PredictResponse = {
  categoryId: string;
  confidence: number;
};
