import pandas as pd
import numpy as np
from typing import List, Dict, Union, Optional
import re
import json
from sklearn.model_selection import train_test_split
import os

def clean_text(text: str) -> str:
    """Clean text by removing special characters and extra whitespace."""
    # Remove special characters
    text = re.sub(r'[^\w\s]', '', text)
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def validate_csv_structure(file_path: str) -> Dict:
    """Validate CSV file structure and content."""
    try:
        df = pd.read_csv(file_path)
        
        # Basic validation
        if df.empty:
            return {'valid': False, 'error': 'File is empty'}
        
        # Check for required columns
        required_columns = ['text']
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            return {
                'valid': False,
                'error': f'Missing required columns: {", ".join(missing_columns)}'
            }
        
        # Check for missing values
        missing_values = df.isnull().sum().to_dict()
        
        # Get data types
        data_types = df.dtypes.astype(str).to_dict()
        
        return {
            'valid': True,
            'columns': list(df.columns),
            'rows': len(df),
            'missing_values': missing_values,
            'data_types': data_types
        }
    
    except Exception as e:
        return {'valid': False, 'error': str(e)}

def validate_excel_structure(file_path: str) -> Dict:
    """Validate Excel file structure and content."""
    try:
        df = pd.read_excel(file_path)
        
        # Basic validation
        if df.empty:
            return {'valid': False, 'error': 'File is empty'}
        
        # Check for required columns
        required_columns = ['text']
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            return {
                'valid': False,
                'error': f'Missing required columns: {", ".join(missing_columns)}'
            }
        
        # Check for missing values
        missing_values = df.isnull().sum().to_dict()
        
        # Get data types
        data_types = df.dtypes.astype(str).to_dict()
        
        return {
            'valid': True,
            'columns': list(df.columns),
            'rows': len(df),
            'missing_values': missing_values,
            'data_types': data_types
        }
    
    except Exception as e:
        return {'valid': False, 'error': str(e)}

def validate_text_file(file_path: str) -> Dict:
    """Validate text file content."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if not content.strip():
            return {'valid': False, 'error': 'File is empty'}
        
        # Basic text validation
        lines = content.split('\n')
        non_empty_lines = [line for line in lines if line.strip()]
        
        return {
            'valid': True,
            'total_lines': len(lines),
            'non_empty_lines': len(non_empty_lines),
            'total_chars': len(content)
        }
    
    except Exception as e:
        return {'valid': False, 'error': str(e)}

def prepare_dataset_for_training(
    file_path: str,
    validation_split: float = 0.1,
    test_split: float = 0.1,
    random_state: int = 42
) -> Dict[str, pd.DataFrame]:
    """Prepare dataset for training with train/validation/test splits."""
    try:
        # Read file based on extension
        if file_path.endswith('.csv'):
            df = pd.read_csv(file_path)
        elif file_path.endswith('.xlsx'):
            df = pd.read_excel(file_path)
        else:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            df = pd.DataFrame({'text': [content]})
        
        # Clean text
        if 'text' in df.columns:
            df['text'] = df['text'].apply(clean_text)
        
        # Split dataset
        train_df, temp_df = train_test_split(
            df,
            test_size=validation_split + test_split,
            random_state=random_state
        )
        
        val_df, test_df = train_test_split(
            temp_df,
            test_size=test_split / (validation_split + test_split),
            random_state=random_state
        )
        
        return {
            'train': train_df,
            'validation': val_df,
            'test': test_df
        }
    
    except Exception as e:
        raise Exception(f"Error preparing dataset: {str(e)}")

def format_prompt_template(
    template: str,
    variables: Dict[str, str]
) -> str:
    """Format prompt template with variables."""
    try:
        return template.format(**variables)
    except KeyError as e:
        raise Exception(f"Missing required variable in template: {str(e)}")
    except Exception as e:
        raise Exception(f"Error formatting template: {str(e)}")

def create_prompt_dataset(
    df: pd.DataFrame,
    template: str,
    input_column: str = 'text',
    output_column: Optional[str] = None
) -> pd.DataFrame:
    """Create dataset with formatted prompts."""
    try:
        # Create copy of dataframe
        result_df = df.copy()
        
        # Format prompts
        result_df['prompt'] = result_df.apply(
            lambda row: format_prompt_template(
                template,
                {input_column: row[input_column]}
            ),
            axis=1
        )
        
        # Add output if specified
        if output_column and output_column in df.columns:
            result_df['output'] = df[output_column]
        
        return result_df
    
    except Exception as e:
        raise Exception(f"Error creating prompt dataset: {str(e)}")

def save_dataset(
    dataset: Dict[str, pd.DataFrame],
    output_dir: str,
    format: str = 'csv'
) -> Dict[str, str]:
    """Save dataset splits to files."""
    try:
        os.makedirs(output_dir, exist_ok=True)
        saved_files = {}
        
        for split_name, split_df in dataset.items():
            output_path = os.path.join(output_dir, f'{split_name}.{format}')
            
            if format == 'csv':
                split_df.to_csv(output_path, index=False)
            elif format == 'json':
                split_df.to_json(output_path, orient='records', indent=2)
            else:
                raise ValueError(f"Unsupported format: {format}")
            
            saved_files[split_name] = output_path
        
        return saved_files
    
    except Exception as e:
        raise Exception(f"Error saving dataset: {str(e)}") 