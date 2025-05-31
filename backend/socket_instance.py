from flask_socketio import SocketIO

# Create a socket instance that can be imported by other modules
socketio = SocketIO(cors_allowed_origins="*", async_mode='eventlet') 