import logging
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from xgboost import XGBClassifier
from data_preprocessor import build_feature_union
from tqdm import tqdm

logger = logging.getLogger(__name__)

def get_models():
    """
    Returns a dictionary of models to be evaluated.
    """
    return {
        'Logistic_Regression': LogisticRegression(max_iter=1000, random_state=42, class_weight='balanced'),
        'Random_Forest': RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced', n_jobs=-1),
        'XGBoost': XGBClassifier(random_state=42, n_jobs=-1),
        'SVM': SVC(kernel='linear', probability=True, random_state=42, class_weight='balanced')
    }

def train_models(X_train, y_train_encoded):
    """
    Trains all models using the FeatureUnion vectorizer.
    Returns a dictionary of trained pipeline objects.
    """
    models = get_models()
    trained_pipelines = {}
    
    # Progress bar for training
    logger.info(f"Starting training for {len(models)} models...")
    for model_name, model in tqdm(models.items(), desc="Training Models"):
        logger.info(f"Training {model_name}...")
        
        # Build the pipeline with vectorizer + classifier
        pipeline = Pipeline([
            ('features', build_feature_union(title_weight=2.0, desc_weight=1.0)),
            ('classifier', model)
        ])
        
        # Train the pipeline
        pipeline.fit(X_train, y_train_encoded)
        trained_pipelines[model_name] = pipeline
        logger.info(f"Successfully trained {model_name}.")
        
    return trained_pipelines
