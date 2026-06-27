import os
import logging
import pandas as pd
from datetime import datetime
import joblib
import json
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import StringTensorType

logger = logging.getLogger(__name__)

def evaluate_models(trained_pipelines, X_test, y_test_encoded):
    """
    Evaluates all trained pipelines on the test set.
    Returns a list of dictionaries containing evaluation metrics.
    """
    results = []
    
    logger.info("Evaluating models on test dataset...")
    for model_name, pipeline in trained_pipelines.items():
        logger.info(f"Evaluating {model_name}...")
        y_pred = pipeline.predict(X_test)
        
        # Calculate metrics (weighted average for multi-class)
        acc = accuracy_score(y_test_encoded, y_pred)
        precision = precision_score(y_test_encoded, y_pred, average='weighted', zero_division=0)
        recall = recall_score(y_test_encoded, y_pred, average='weighted', zero_division=0)
        f1 = f1_score(y_test_encoded, y_pred, average='weighted', zero_division=0)
        
        results.append({
            'Model': model_name,
            'Accuracy': acc,
            'Precision': precision,
            'Recall': recall,
            'F1_Score': f1
        })
        
        logger.info(f"[{model_name}] F1-Score (Weighted): {f1:.4f}")
        
    return results

def save_report_and_model(results, trained_pipelines, label_encoder, total_records=0, train_records=0, test_records=0, output_dir='models'):
    """
    Saves the evaluation report to a CSV and persists the best model to disk.
    """
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    timestamp = datetime.now().strftime('%Y%m%dT%H%M%S')
    
    # 1. Save the report (as markdown)
    eval_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    report_lines = [
        f"# Model Evaluation Report",
        f"**Date:** {eval_time}",
        f"**Total Records:** {total_records} | **Training:** {train_records} | **Testing:** {test_records}",
        "",
        "| Model | Accuracy | Precision | Recall | F1 Score |",
        "|-------|----------|-----------|--------|----------|"
    ]
    
    for row in results:
        report_lines.append(f"| {row['Model']} | {row['Accuracy']:.4f} | {row['Precision']:.4f} | {row['Recall']:.4f} | {row['F1_Score']:.4f} |")
        
    report_filename = "report.md"
    report_path = os.path.join(output_dir, report_filename)
    
    with open(report_path, "w") as f:
        f.write("\n".join(report_lines))
        
    logger.info(f"Saved markdown evaluation report to {report_path}")
    
    # Reconstruct df_results to find the best model
    df_results = pd.DataFrame(results)
    
    # 2. Find and save the best model
    best_model_row = df_results.loc[df_results['F1_Score'].idxmax()]
    best_model_name = best_model_row['Model']
    best_f1 = best_model_row['F1_Score']
    
    logger.info(f"Best Model: {best_model_name} with F1-Score: {best_f1:.4f}")
    
    best_pipeline = trained_pipelines[best_model_name]
    
    # Save a dictionary containing both the pipeline and the label encoder
    model_artifact = {
        'pipeline': best_pipeline,
        'label_encoder': label_encoder
    }
    
    model_filename = f"{best_model_name.lower()}_{timestamp}.joblib"
    model_path = os.path.join(output_dir, model_filename)
    joblib.dump(model_artifact, model_path)
    logger.info(f"Saved best model artifact to {model_path}")
    
    # Save ONNX Model
    initial_type = [('title', StringTensorType([None, 1])), 
                    ('description', StringTensorType([None, 1]))]
    
    try:
        onx = convert_sklearn(best_pipeline, initial_types=initial_type, options={'zipmap': False})
        onnx_filename = "expense_classifier.onnx"
        onnx_path = os.path.join(output_dir, onnx_filename)
        with open(onnx_path, "wb") as f:
            f.write(onx.SerializeToString())
        logger.info(f"Saved ONNX model to {onnx_path}")
    except Exception as e:
        logger.exception(f"Failed to export ONNX model: {e}")

    # Save classes.json
    classes_dict = {str(i): cls for i, cls in enumerate(label_encoder.classes_)}
    classes_filename = "classes.json"
    classes_path = os.path.join(output_dir, classes_filename)
    with open(classes_path, "w") as f:
        json.dump(classes_dict, f, indent=4)
    logger.info(f"Saved label mapping to {classes_path}")
    
    return model_path
