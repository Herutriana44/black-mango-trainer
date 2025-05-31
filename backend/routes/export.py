from flask import Blueprint, request, jsonify, current_app
from huggingface_hub import HfApi, create_repo
import os
import json
import gradio as gr
from fastapi import FastAPI
import uvicorn
import threading

export_bp = Blueprint('export', __name__)

# Global variables for deployment
deployment_state = {
    'is_deployed': False,
    'deployment_type': None,
    'deployment_url': None
}

@export_bp.route('/export', methods=['POST'])
def export_model():
    data = request.get_json()
    if not data or 'repo_name' not in data or 'api_key' not in data:
        return jsonify({'error': 'Missing repo_name or api_key'}), 400
    
    try:
        repo_name = data['repo_name']
        api_key = data['api_key']
        
        # Create repository on Hugging Face Hub
        api = HfApi(token=api_key)
        create_repo(repo_name, token=api_key, exist_ok=True)
        
        # Get the latest checkpoint
        checkpoints_dir = os.path.join(current_app.config['MODEL_CACHE'], 'checkpoints')
        latest_checkpoint = None
        
        if os.path.exists(checkpoints_dir):
            checkpoints = [d for d in os.listdir(checkpoints_dir) if d.startswith('checkpoint-')]
            if checkpoints:
                latest_checkpoint = max(checkpoints, key=lambda x: int(x.split('-')[1]))
        
        if not latest_checkpoint:
            return jsonify({'error': 'No checkpoint found'}), 400
        
        # Upload model to Hugging Face Hub
        model_path = os.path.join(checkpoints_dir, latest_checkpoint)
        api.upload_folder(
            folder_path=model_path,
            repo_id=repo_name,
            repo_type="model"
        )
        
        return jsonify({
            'message': 'Model exported successfully',
            'repo_name': repo_name,
            'model_url': f'https://huggingface.co/{repo_name}'
        })
        
    except Exception as e:
        return jsonify({'error': f'Error exporting model: {str(e)}'}), 400

@export_bp.route('/deploy', methods=['POST'])
def deploy_model():
    global deployment_state
    
    if deployment_state['is_deployed']:
        return jsonify({'error': 'Model already deployed'}), 400
    
    data = request.get_json()
    if not data or 'deployment_type' not in data:
        return jsonify({'error': 'Missing deployment_type'}), 400
    
    try:
        deployment_type = data['deployment_type']
        
        if deployment_type == 'gradio':
            # Create Gradio interface
            def generate_text(prompt, max_length=100):
                inputs = current_tokenizer(prompt, return_tensors="pt").to(current_model.device)
                outputs = current_model.generate(
                    **inputs,
                    max_length=max_length,
                    num_return_sequences=1,
                    temperature=0.7
                )
                return current_tokenizer.decode(outputs[0], skip_special_tokens=True)
            
            interface = gr.Interface(
                fn=generate_text,
                inputs=[
                    gr.Textbox(label="Input Prompt"),
                    gr.Slider(minimum=10, maximum=200, value=100, label="Max Length")
                ],
                outputs=gr.Textbox(label="Generated Text"),
                title="Fine-tuned LLM Chat Interface"
            )
            
            # Start Gradio server in background
            def run_gradio():
                interface.launch(share=True)
            
            thread = threading.Thread(target=run_gradio)
            thread.start()
            
            deployment_state.update({
                'is_deployed': True,
                'deployment_type': 'gradio',
                'deployment_url': interface.local_url
            })
            
        elif deployment_type == 'api':
            # Create FastAPI app
            app = FastAPI()
            
            @app.post("/generate")
            async def generate(prompt: str, max_length: int = 100):
                inputs = current_tokenizer(prompt, return_tensors="pt").to(current_model.device)
                outputs = current_model.generate(
                    **inputs,
                    max_length=max_length,
                    num_return_sequences=1,
                    temperature=0.7
                )
                return {"generated_text": current_tokenizer.decode(outputs[0], skip_special_tokens=True)}
            
            # Start FastAPI server in background
            def run_fastapi():
                uvicorn.run(app, host="0.0.0.0", port=8000)
            
            thread = threading.Thread(target=run_fastapi)
            thread.start()
            
            deployment_state.update({
                'is_deployed': True,
                'deployment_type': 'api',
                'deployment_url': 'http://localhost:8000'
            })
        
        else:
            return jsonify({'error': 'Invalid deployment type'}), 400
        
        return jsonify({
            'message': 'Model deployed successfully',
            'deployment_state': deployment_state
        })
        
    except Exception as e:
        deployment_state['is_deployed'] = False
        return jsonify({'error': f'Error deploying model: {str(e)}'}), 400

@export_bp.route('/deployment_status', methods=['GET'])
def get_deployment_status():
    return jsonify({
        'message': 'Deployment status retrieved successfully',
        'deployment_state': deployment_state
    })

@export_bp.route('/undeploy', methods=['POST'])
def undeploy_model():
    global deployment_state
    
    if not deployment_state['is_deployed']:
        return jsonify({'error': 'No model deployed'}), 400
    
    try:
        # Reset deployment state
        deployment_state.update({
            'is_deployed': False,
            'deployment_type': None,
            'deployment_url': None
        })
        
        return jsonify({
            'message': 'Model undeployed successfully'
        })
        
    except Exception as e:
        return jsonify({'error': f'Error undeploying model: {str(e)}'}), 400 