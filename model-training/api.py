import os
import glob
import logging
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI(title="Expense Classifier API", version="1.0")

# Global variables for model and label encoder
model_pipeline = None
label_encoder = None

class PredictionRequest(BaseModel):
    title: str
    description: str = ""

class PredictionResponse(BaseModel):
    categoryId: str
    confidence_score: float

def get_latest_model(models_dir='models'):
    """Finds the most recently created joblib file in the models directory."""
    if not os.path.exists(models_dir):
        return None
    
    list_of_files = glob.glob(f'{models_dir}/*.joblib')
    if not list_of_files:
        return None
        
    latest_file = max(list_of_files, key=os.path.getctime)
    return latest_file

@app.on_event("startup")
async def startup_event():
    global model_pipeline, label_encoder
    
    logger.info("Starting up FastAPI Server...")
    latest_model_path = get_latest_model()
    
    if not latest_model_path:
        logger.warning("No trained models found in the models/ directory. Predictions will fail.")
        return
        
    logger.info(f"Loading model from {latest_model_path}...")
    try:
        model_artifact = joblib.load(latest_model_path)
        model_pipeline = model_artifact['pipeline']
        label_encoder = model_artifact['label_encoder']
        logger.info("Successfully loaded model and label encoder.")
    except Exception as e:
        logger.error(f"Failed to load model: {e}")

@app.post("/predict", response_model=PredictionResponse)
async def predict_expense(request: PredictionRequest):
    global model_pipeline, label_encoder
    
    if not model_pipeline or not label_encoder:
        raise HTTPException(status_code=503, detail="Model is not loaded. Please train the model first.")
        
    try:
        # Create a list of dictionaries for prediction 
        # Our custom ColumnSelector inside data_preprocessor handles this format correctly
        data = [{'title': request.title, 'description': request.description}]
        
        # Predict probabilities
        probabilities = model_pipeline.predict_proba(data)[0]
        
        # Get highest probability index
        best_class_idx = probabilities.argmax()
        confidence_score = float(probabilities[best_class_idx])
        
        # Decode the predicted index back to original categoryId string
        predicted_category_id = label_encoder.inverse_transform([best_class_idx])[0]
        
        return PredictionResponse(
            categoryId=predicted_category_id,
            confidence_score=confidence_score
        )
    except Exception as e:
        logger.error(f"Error during prediction: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
