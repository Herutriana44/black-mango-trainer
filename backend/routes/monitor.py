from flask import Blueprint, request, jsonify, current_app
import torch
import psutil
import GPUtil
from datetime import datetime
import json
import os

monitor_bp = Blueprint('monitor', __name__)

@monitor_bp.route('/monitor', methods=['GET'])
def get_training_metrics():
    try:
        # Get system metrics
        cpu_percent = psutil.cpu_percent()
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        
        # Get GPU metrics if available
        gpu_metrics = []
        if torch.cuda.is_available():
            gpus = GPUtil.getGPUs()
            for gpu in gpus:
                gpu_metrics.append({
                    'id': gpu.id,
                    'name': gpu.name,
                    'load': gpu.load * 100,
                    'memory_used': gpu.memoryUsed,
                    'memory_total': gpu.memoryTotal,
                    'temperature': gpu.temperature
                })
        
        # Get training logs if available
        training_logs = []
        log_path = os.path.join(current_app.config['MODEL_CACHE'], 'checkpoints', 'trainer_log.jsonl')
        if os.path.exists(log_path):
            with open(log_path, 'r') as f:
                for line in f:
                    try:
                        log_entry = json.loads(line.strip())
                        training_logs.append(log_entry)
                    except json.JSONDecodeError:
                        continue
        
        # Get latest training metrics
        latest_metrics = {}
        if training_logs:
            latest_metrics = training_logs[-1]
        
        return jsonify({
            'message': 'Training metrics retrieved successfully',
            'system_metrics': {
                'cpu_percent': cpu_percent,
                'memory': {
                    'total': memory.total,
                    'available': memory.available,
                    'percent': memory.percent
                },
                'disk': {
                    'total': disk.total,
                    'used': disk.used,
                    'free': disk.free,
                    'percent': disk.percent
                }
            },
            'gpu_metrics': gpu_metrics,
            'training_metrics': latest_metrics,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({'error': f'Error getting training metrics: {str(e)}'}), 400

@monitor_bp.route('/logs', methods=['GET'])
def get_training_logs():
    try:
        # Get training logs
        training_logs = []
        log_path = os.path.join(current_app.config['MODEL_CACHE'], 'checkpoints', 'trainer_log.jsonl')
        
        if os.path.exists(log_path):
            with open(log_path, 'r') as f:
                for line in f:
                    try:
                        log_entry = json.loads(line.strip())
                        training_logs.append(log_entry)
                    except json.JSONDecodeError:
                        continue
        
        return jsonify({
            'message': 'Training logs retrieved successfully',
            'logs': training_logs
        })
        
    except Exception as e:
        return jsonify({'error': f'Error getting training logs: {str(e)}'}), 400

@monitor_bp.route('/checkpoints', methods=['GET'])
def get_checkpoints():
    try:
        checkpoints_dir = os.path.join(current_app.config['MODEL_CACHE'], 'checkpoints')
        checkpoints = []
        
        if os.path.exists(checkpoints_dir):
            for item in os.listdir(checkpoints_dir):
                if item.startswith('checkpoint-'):
                    checkpoint_path = os.path.join(checkpoints_dir, item)
                    if os.path.isdir(checkpoint_path):
                        checkpoints.append({
                            'name': item,
                            'path': checkpoint_path,
                            'created_at': datetime.fromtimestamp(
                                os.path.getctime(checkpoint_path)
                            ).isoformat()
                        })
        
        return jsonify({
            'message': 'Checkpoints retrieved successfully',
            'checkpoints': checkpoints
        })
        
    except Exception as e:
        return jsonify({'error': f'Error getting checkpoints: {str(e)}'}), 400 