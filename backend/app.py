from flask import Flask, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Initialize Socket.IO with CORS support
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')

# Configuration
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MODEL_CACHE'] = 'model_cache'

# Create necessary directories
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['MODEL_CACHE'], exist_ok=True)

# Import routes
from routes.upload import upload_bp
from routes.model import model_bp
from routes.training import training_bp
from routes.monitor import monitor_bp
from routes.export import export_bp

# Register blueprints
app.register_blueprint(upload_bp, url_prefix='/api')
app.register_blueprint(model_bp, url_prefix='/api')
app.register_blueprint(training_bp, url_prefix='/api')
app.register_blueprint(monitor_bp, url_prefix='/api')
app.register_blueprint(export_bp, url_prefix='/api')

# Socket.IO event handlers
@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('subscribe_training')
def handle_subscribe_training(data):
    print(f'Client subscribed to training updates: {data}')

@app.route('/api/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'Flask backend is running'
    })

if __name__ == '__main__':
    import eventlet
    eventlet.monkey_patch()
    socketio.run(app, host='0.0.0.0', port=5000, debug=True) 