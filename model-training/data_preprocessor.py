import pandas as pd
import numpy as np
import logging
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.feature_extraction.text import TfidfVectorizer

logger = logging.getLogger(__name__)

def preprocess_dataframe(df, min_samples=25):
    """
    Cleans the DataFrame by:
    1. Filtering out categories with < min_samples.
    2. Handling missing descriptions.
    """
    if df.empty:
        logger.warning("Empty dataframe provided for preprocessing.")
        return df
        
    initial_len = len(df)
    
    # 1. Filter out categories with less than 25 expenses
    category_counts = df['categoryId'].value_counts()
    valid_categories = category_counts[category_counts >= min_samples].index
    df = df[df['categoryId'].isin(valid_categories)].copy()
    
    filtered_len = len(df)
    logger.info(f"Filtered out {initial_len - filtered_len} expenses due to infrequent categories (< {min_samples} samples).")
    
    # 2. Handle missing descriptions and titles
    # Ensure title is string, fill missing description with empty string
    df['title'] = df['title'].fillna('').astype(str)
    df['description'] = df['description'].fillna('').astype(str)
    
    # Text normalization (lowercasing)
    df['title'] = df['title'].str.lower()
    df['description'] = df['description'].str.lower()
    
    return df



def build_feature_union(title_weight=2.0, desc_weight=1.0):
    """
    Builds a ColumnTransformer that vectorizes 'title' and 'description' separately,
    giving higher weight to the 'title' features.
    """
    preprocessor = ColumnTransformer(
        transformers=[
            ('title_features', TfidfVectorizer(stop_words='english', max_features=5000), 'title'),
            ('desc_features', TfidfVectorizer(stop_words='english', max_features=5000), 'description')
        ],
        transformer_weights={
            'title_features': title_weight,
            'desc_features': desc_weight
        }
    )
    return preprocessor

def get_train_test_split(df, test_size=0.2, random_state=42):
    """
    Splits the dataframe into training and testing sets.
    """
    if df.empty:
        raise ValueError("Dataframe is empty, cannot split.")
        
    X = df[['title', 'description']]
    y = df['categoryId']
    
    # Use stratify to ensure proportional representation of categories in test set
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state, stratify=y
    )
    
    logger.info(f"Split data into {len(X_train)} training and {len(X_test)} testing samples.")
    return X_train, X_test, y_train, y_test

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    from data_loader import load_data
    
    try:
        df = load_data()
        if not df.empty:
            df_clean = preprocess_dataframe(df)
            X_train, X_test, y_train, y_test = get_train_test_split(df_clean)
            
            # Test feature union
            features = build_feature_union()
            X_train_vectorized = features.fit_transform(X_train)
            logger.info(f"Vectorized training data shape: {X_train_vectorized.shape}")
    except Exception as e:
        logger.exception(f"Error during preprocessing: {e}")
