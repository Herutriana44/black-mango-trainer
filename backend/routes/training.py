from flask import Blueprint, request, jsonify, current_app
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
from transformers import TrainingArguments, Trainer
from datasets import Dataset
import torch
import os
import json
from datetime import datetime
from flask_socketio import emit
from ..socket_instance import socketio

training_bp = Blueprint('training', __name__)

# Global variables for training state
training_state = {
    'is_training': False,
    'current_epoch': 0,
    'total_epochs': 0,
    'current_loss': 0.0,
    'start_time': None,
    'end_time': None
}

class TrainingCallback:
    def __init__(self):
        self.current_epoch = 0
        self.total_epochs = 0
        self.current_loss = 0.0

    def on_epoch_end(self, epoch, logs=None):
        self.current_epoch = epoch
        self.current_loss = logs.get('loss', 0.0) if logs else 0.0
        
        # Emit training progress
        socketio.emit('training_progress', {
            'epoch': self.current_epoch,
            'total_epochs': self.total_epochs,
            'loss': self.current_loss,
            'timestamp': datetime.now().isoformat()
        })

    def on_train_end(self, logs=None):
        socketio.emit('training_complete', {
            'final_loss': self.current_loss,
            'total_epochs': self.total_epochs,
            'end_time': datetime.now().isoformat()
        })

@training_bp.route('/config', methods=['POST'])
def set_training_config():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No configuration provided'}), 400
    
    try:
        # Save training configuration
        config_path = os.path.join(current_app.config['UPLOAD_FOLDER'], 'training_config.json')
        with open(config_path, 'w') as f:
            json.dump(data, f)
        
        return jsonify({
            'message': 'Training configuration saved successfully',
            'config': data
        })
        
    except Exception as e:
        return jsonify({'error': f'Error saving configuration: {str(e)}'}), 400

@training_bp.route('/start_finetune', methods=['POST'])
def start_finetune():
    global training_state
    
    if training_state['is_training']:
        return jsonify({'error': 'Training already in progress'}), 400
    
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No training parameters provided'}), 400
    
    try:
        # Load configuration
        config_path = os.path.join(current_app.config['UPLOAD_FOLDER'], 'training_config.json')
        with open(config_path, 'r') as f:
            config = json.load(f)
        
        # Set up training parameters
        training_args = TrainingArguments(
            output_dir=os.path.join(current_app.config['MODEL_CACHE'], 'checkpoints'),
            num_train_epochs=config.get('epochs', 3),
            per_device_train_batch_size=config.get('batch_size', 4),
            learning_rate=config.get('learning_rate', 2e-4),
            max_grad_norm=config.get('max_grad_norm', 0.3),
            warmup_ratio=config.get('warmup_ratio', 0.03),
            logging_steps=config.get('logging_steps', 10),
            save_strategy="epoch",
            evaluation_strategy="epoch" if config.get('validation_split', 0) > 0 else "no",
        )
        
        # Initialize callback
        callback = TrainingCallback()
        callback.total_epochs = config.get('epochs', 3)
        
        # Prepare model based on fine-tuning type
        if config.get('finetune_type') == 'lora':
            lora_config = LoraConfig(
                r=config.get('lora_r', 16),
                lora_alpha=config.get('lora_alpha', 32),
                target_modules=config.get('target_modules', ['q_proj', 'v_proj']),
                lora_dropout=config.get('lora_dropout', 0.05),
                bias="none",
                task_type="CAUSAL_LM"
            )
            model = get_peft_model(current_model, lora_config)
        
        elif config.get('finetune_type') == 'qlora':
            model = prepare_model_for_kbit_training(current_model)
            lora_config = LoraConfig(
                r=config.get('lora_r', 16),
                lora_alpha=config.get('lora_alpha', 32),
                target_modules=config.get('target_modules', ['q_proj', 'v_proj']),
                lora_dropout=config.get('lora_dropout', 0.05),
                bias="none",
                task_type="CAUSAL_LM"
            )
            model = get_peft_model(model, lora_config)
        
        else:  # Full fine-tuning
            model = current_model
        
        # Prepare dataset
        dataset_path = os.path.join(current_app.config['UPLOAD_FOLDER'], config['dataset_file'])
        if dataset_path.endswith('.csv'):
            df = pd.read_csv(dataset_path)
        elif dataset_path.endswith('.xlsx'):
            df = pd.read_excel(dataset_path)
        else:
            with open(dataset_path, 'r', encoding='utf-8') as f:
                content = f.read()
            df = pd.DataFrame({'text': [content]})
        
        dataset = Dataset.from_pandas(df)
        
        # Start training
        trainer = Trainer(
            model=model,
            args=training_args,
            train_dataset=dataset,
            tokenizer=current_tokenizer,
            callbacks=[callback]
        )
        
        # Update training state
        training_state.update({
            'is_training': True,
            'current_epoch': 0,
            'total_epochs': config.get('epochs', 3),
            'start_time': datetime.now()
        })
        
        # Emit training start event
        socketio.emit('training_start', {
            'config': config,
            'start_time': training_state['start_time'].isoformat()
        })
        
        # Start training in background
        trainer.train()
        
        # Update training state after completion
        training_state.update({
            'is_training': False,
            'end_time': datetime.now()
        })
        
        return jsonify({
            'message': 'Training started successfully',
            'training_state': training_state
        })
        
    except Exception as e:
        training_state['is_training'] = False
        socketio.emit('training_error', {
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        })
        return jsonify({'error': f'Error starting training: {str(e)}'}), 400

@training_bp.route('/training_status', methods=['GET'])
def get_training_status():
    return jsonify({
        'message': 'Training status retrieved successfully',
        'training_state': training_state
    }) 