from flask import Blueprint, request, jsonify
import os
import pandas as pd
from werkzeug.utils import secure_filename
import json

upload_bp = Blueprint('upload', __name__)

ALLOWED_EXTENSIONS = {'csv', 'xlsx', 'txt', 'md'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@upload_bp.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Validate file structure
        try:
            if filename.endswith('.csv'):
                df = pd.read_csv(filepath)
            elif filename.endswith('.xlsx'):
                df = pd.read_excel(filepath)
            elif filename.endswith('.txt'):
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                df = pd.DataFrame({'text': [content]})
            elif filename.endswith('.md'):
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                df = pd.DataFrame({'text': [content]})
            
            # Basic validation
            if df.empty:
                return jsonify({'error': 'File is empty'}), 400
            
            # Preview first 5 rows
            preview = df.head().to_dict(orient='records')
            
            return jsonify({
                'message': 'File uploaded successfully',
                'filename': filename,
                'preview': preview,
                'total_rows': len(df)
            })
            
        except Exception as e:
            return jsonify({'error': f'Error processing file: {str(e)}'}), 400
    
    return jsonify({'error': 'File type not allowed'}), 400

@upload_bp.route('/validate', methods=['POST'])
def validate_dataset():
    data = request.get_json()
    if not data or 'filename' not in data:
        return jsonify({'error': 'No filename provided'}), 400
    
    filename = secure_filename(data['filename'])
    filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
    
    if not os.path.exists(filepath):
        return jsonify({'error': 'File not found'}), 404
    
    try:
        if filename.endswith('.csv'):
            df = pd.read_csv(filepath)
        elif filename.endswith('.xlsx'):
            df = pd.read_excel(filepath)
        elif filename.endswith('.txt'):
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            df = pd.DataFrame({'text': [content]})
        elif filename.endswith('.md'):
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            df = pd.DataFrame({'text': [content]})
        
        # Perform validation
        validation_results = {
            'total_rows': len(df),
            'columns': list(df.columns),
            'missing_values': df.isnull().sum().to_dict(),
            'data_types': df.dtypes.astype(str).to_dict(),
            'sample_data': df.head().to_dict(orient='records')
        }
        
        return jsonify({
            'message': 'Dataset validation successful',
            'validation_results': validation_results
        })
        
    except Exception as e:
        return jsonify({'error': f'Error validating dataset: {str(e)}'}), 400 