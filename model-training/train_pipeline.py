import logging
import os
from data_loader import load_data
from data_preprocessor import preprocess_dataframe, get_train_test_split
from model_trainer import train_models
from model_evaluator import evaluate_models, save_report_and_model
from sklearn.preprocessing import LabelEncoder

# Set up logging for the main pipeline
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def run_pipeline():
    logger.info("=== Starting Expense Classifier Training Pipeline ===")
    
    # 1. Load Data
    logger.info("--- Step 1: Loading Data ---")
    raw_data = load_data()
    if raw_data.empty:
        logger.error("No data loaded. Exiting pipeline.")
        return
        
    # 2. Preprocess Data
    logger.info("--- Step 2: Preprocessing Data ---")
    clean_data = preprocess_dataframe(raw_data, min_samples=25)
    if clean_data.empty:
         logger.error("Data is empty after preprocessing. Exiting pipeline.")
         return
         
    # Split Data
    X_train, X_test, y_train, y_test = get_train_test_split(clean_data, test_size=0.2)
    
    # Encode Labels
    logger.info("Encoding target labels...")
    label_encoder = LabelEncoder()
    y_train_encoded = label_encoder.fit_transform(y_train)
    y_test_encoded = label_encoder.transform(y_test)
    
    logger.info(f"Classes found ({len(label_encoder.classes_)}): {label_encoder.classes_[:5]}...")
    
    # 3. Train Models
    logger.info("--- Step 3: Training Models ---")
    trained_pipelines = train_models(X_train, y_train_encoded)
    
    # 4. Evaluate Models
    logger.info("--- Step 4: Evaluating Models ---")
    results = evaluate_models(trained_pipelines, X_test, y_test_encoded, label_encoder)
    
    # 5. Save Report and Best Model
    logger.info("--- Step 5: Saving Artifacts ---")
    output_path = os.path.join(os.path.dirname(__file__), '..', 'src', 'ml-models')
    save_report_and_model(results, trained_pipelines, label_encoder, output_dir=output_path)
    
    logger.info("=== Pipeline Execution Completed Successfully ===")

if __name__ == "__main__":
    try:
        run_pipeline()
    except Exception as e:
        logger.error(f"Pipeline failed with error: {e}", exc_info=True)
