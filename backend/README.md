# LLM Fine-tuning Backend

This is the backend API for the LLM fine-tuning application, built with Flask and designed to run in Google Colab. It provides endpoints for uploading datasets, fine-tuning models, monitoring training progress, and deploying the fine-tuned models.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your Hugging Face API key and other configurations
```

3. Run the Flask application:
```bash
python app.py
```

## API Endpoints

### Upload & Validation
- `POST /api/upload`: Upload dataset file (CSV, Excel, TXT, MD)
- `POST /api/validate`: Validate dataset structure and content

### Model Management
- `POST /api/load_model`: Load model from Hugging Face
- `GET /api/model_info`: Get current model information
- `POST /api/unload_model`: Unload current model

### Training
- `POST /api/config`: Set training configuration
- `POST /api/start_finetune`: Start fine-tuning process
- `GET /api/training_status`: Get current training status

### Monitoring
- `GET /api/monitor`: Get training metrics and system status
- `GET /api/logs`: Get training logs
- `GET /api/checkpoints`: List available model checkpoints

### Export & Deployment
- `POST /api/export`: Export model to Hugging Face Hub
- `POST /api/deploy`: Deploy model (Gradio or FastAPI)
- `GET /api/deployment_status`: Get deployment status
- `POST /api/undeploy`: Undeploy current model

## Fine-tuning Types

The backend supports various fine-tuning methods:
- Full Fine-tuning
- LoRA (Low-Rank Adaptation)
- QLoRA (Quantized LoRA)
- SFT (Supervised Fine-tuning)
- DPO (Direct Preference Optimization)

## Usage in Google Colab

1. Mount Google Drive (optional):
```python
from google.colab import drive
drive.mount('/content/drive')
```

2. Install dependencies:
```python
!pip install -r requirements.txt
```

3. Run the Flask app with ngrok:
```python
!pip install pyngrok
from pyngrok import ngrok
ngrok_tunnel = ngrok.connect(5000)
print('Public URL:', ngrok_tunnel.public_url)
```

4. Connect your React frontend to the ngrok URL.

## Security Considerations

- Always use HTTPS in production
- Keep API keys secure and never expose them in the frontend
- Implement rate limiting for API endpoints
- Validate all input data
- Use secure file handling practices

## Error Handling

The API returns appropriate HTTP status codes and error messages:
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License 