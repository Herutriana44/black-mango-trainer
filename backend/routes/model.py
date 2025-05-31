from flask import Blueprint, request, jsonify, current_app
from transformers import AutoModelForCausalLM, AutoTokenizer
from huggingface_hub import login
import torch
import os

model_bp = Blueprint('model', __name__)

# Global variables to store model and tokenizer
current_model = None
current_tokenizer = None

@model_bp.route('/load_model', methods=['POST'])
def load_model():
    global current_model, current_tokenizer
    
    data = request.get_json()
    if not data or 'model_name' not in data or 'api_key' not in data:
        return jsonify({'error': 'Missing model_name or api_key'}), 400
    
    model_name = data['model_name']
    api_key = data['api_key']
    
    try:
        # Login to Hugging Face
        login(token=api_key)
        
        # Load model and tokenizer
        current_tokenizer = AutoTokenizer.from_pretrained(model_name)
        current_model = AutoModelForCausalLM.from_pretrained(
            model_name,
            torch_dtype=torch.float16,
            device_map="auto"
        )
        
        # Get model info
        model_info = {
            'name': model_name,
            'type': current_model.__class__.__name__,
            'parameters': sum(p.numel() for p in current_model.parameters()),
            'device': str(current_model.device)
        }
        
        return jsonify({
            'message': 'Model loaded successfully',
            'model_info': model_info
        })
        
    except Exception as e:
        return jsonify({'error': f'Error loading model: {str(e)}'}), 400

@model_bp.route('/model_info', methods=['GET'])
def get_model_info():
    if current_model is None:
        return jsonify({'error': 'No model loaded'}), 400
    
    try:
        model_info = {
            'name': current_model.name_or_path,
            'type': current_model.__class__.__name__,
            'parameters': sum(p.numel() for p in current_model.parameters()),
            'device': str(current_model.device),
            'dtype': str(current_model.dtype)
        }
        
        return jsonify({
            'message': 'Model info retrieved successfully',
            'model_info': model_info
        })
        
    except Exception as e:
        return jsonify({'error': f'Error getting model info: {str(e)}'}), 400

@model_bp.route('/unload_model', methods=['POST'])
def unload_model():
    global current_model, current_tokenizer
    
    try:
        if current_model is not None:
            del current_model
            current_model = None
        
        if current_tokenizer is not None:
            del current_tokenizer
            current_tokenizer = None
        
        # Clear CUDA cache
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
        
        return jsonify({
            'message': 'Model unloaded successfully'
        })
        
    except Exception as e:
        return jsonify({'error': f'Error unloading model: {str(e)}'}), 400 