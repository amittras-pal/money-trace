import os
import logging
import pandas as pd
from pymongo import MongoClient
from dotenv import load_dotenv

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def get_database():
    """Connects to MongoDB and returns the database instance."""
    # Load .env from the express app root (parent directory)
    env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
    load_dotenv(dotenv_path=env_path)
    
    db_uri = os.getenv("DB_URI")
    
    if not db_uri:
        logger.error("DB_URI environment variable not set. Please set it in your .env file.")
        raise ValueError("Missing MongoDB configuration in environment variables.")
        
    logger.info("Connecting to MongoDB...")
    client = MongoClient(db_uri)
    
    # Check connection
    try:
        client.admin.command('ping')
        logger.info("Successfully connected to MongoDB.")
    except Exception as e:
        logger.exception(f"Failed to connect to MongoDB: {e}")
        raise
        
    return client.get_default_database()

def extract_oid(val):
    """
    Helper to extract MongoDB ObjectIds gracefully.
    Handles both native bson.objectid.ObjectId and dict structures like {'$oid': '...'}.
    """
    if isinstance(val, dict) and '$oid' in val:
        return val['$oid']
    elif pd.isna(val):
        return val
    return str(val)

def load_data():
    """
    Fetches expenses and categories from MongoDB and merges them into a single DataFrame.
    """
    db = get_database()
    
    logger.info("Fetching expenses...")
    # Fetch all expenses
    expenses_cursor = db.expenses.find({})
    expenses_df = pd.DataFrame(list(expenses_cursor))
    
    if expenses_df.empty:
        logger.warning("No expenses found in the database.")
        return pd.DataFrame()
        
    logger.info(f"Fetched {len(expenses_df)} expenses.")
    
    logger.info("Fetching categories...")
    # Fetch all categories
    categories_cursor = db.categories.find({})
    categories_df = pd.DataFrame(list(categories_cursor))
    
    if categories_df.empty:
        logger.warning("No categories found in the database.")
        return expenses_df
        
    logger.info(f"Fetched {len(categories_df)} categories.")
    
    logger.info("Processing ObjectIds and merging datasets...")
    
    # Safely convert ObjectIds to strings for merging
    if '_id' in expenses_df.columns:
        expenses_df['_id'] = expenses_df['_id'].apply(extract_oid)
        
    if 'categoryId' in expenses_df.columns:
        expenses_df['categoryId'] = expenses_df['categoryId'].apply(extract_oid)
        
    if '_id' in categories_df.columns:
        categories_df['_id'] = categories_df['_id'].apply(extract_oid)
        # Rename category _id to categoryId to facilitate merge
        categories_df = categories_df.rename(columns={'_id': 'categoryId'})
        
    # Merge datasets on categoryId using left join
    merged_df = pd.merge(
        expenses_df, 
        categories_df, 
        on='categoryId', 
        how='left', 
        suffixes=('_expense', '_category'),
        validate='many_to_one'
    )
    
    logger.info(f"Merged dataset contains {len(merged_df)} rows and {len(merged_df.columns)} columns.")
    return merged_df

if __name__ == "__main__":
    # Test script execution
    try:
        df = load_data()
        print("\nFirst 5 rows of merged data:")
        print(df.head())
    except Exception as e:
        logger.exception(f"Error during data loading: {e}")
