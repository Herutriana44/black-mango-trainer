from huggingface_hub import HfApi, create_repo, login
import os
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

def login_to_hub(api_key):
    """Login to Hugging Face Hub."""
    try:
        login(token=api_key)
        return True
    except Exception as e:
        raise Exception(f"Failed to login to Hugging Face Hub: {str(e)}")

def create_hub_repo(repo_name, api_key, private=False):
    """Create a new repository on Hugging Face Hub."""
    try:
        create_repo(repo_name, token=api_key, private=private, exist_ok=True)
        return True
    except Exception as e:
        raise Exception(f"Failed to create repository: {str(e)}")

def upload_to_hub(model_path, repo_name, api_key):
    """Upload model to Hugging Face Hub."""
    try:
        api = HfApi(token=api_key)
        api.upload_folder(
            folder_path=model_path,
            repo_id=repo_name,
            repo_type="model"
        )
        return f"https://huggingface.co/{repo_name}"
    except Exception as e:
        raise Exception(f"Failed to upload model: {str(e)}")

def load_model_from_hub(model_name, api_key=None, device_map="auto"):
    """Load model and tokenizer from Hugging Face Hub."""
    try:
        # Login if API key is provided
        if api_key:
            login_to_hub(api_key)
        
        # Load tokenizer
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        
        # Load model
        model = AutoModelForCausalLM.from_pretrained(
            model_name,
            torch_dtype=torch.float16,
            device_map=device_map
        )
        
        return model, tokenizer
    except Exception as e:
        raise Exception(f"Failed to load model: {str(e)}")

def get_model_info(model):
    """Get information about the loaded model."""
    try:
        return {
            'name': model.name_or_path,
            'type': model.__class__.__name__,
            'parameters': sum(p.numel() for p in model.parameters()),
            'device': str(model.device),
            'dtype': str(model.dtype)
        }
    except Exception as e:
        raise Exception(f"Failed to get model info: {str(e)}")

def push_to_hub(model, tokenizer, repo_name, api_key, commit_message="Update model"):
    """Push model and tokenizer to Hugging Face Hub."""
    try:
        # Login to Hub
        login_to_hub(api_key)
        
        # Push model and tokenizer
        model.push_to_hub(repo_name, commit_message=commit_message)
        tokenizer.push_to_hub(repo_name, commit_message=commit_message)
        
        return f"https://huggingface.co/{repo_name}"
    except Exception as e:
        raise Exception(f"Failed to push to Hub: {str(e)}")

def download_from_hub(repo_name, api_key=None, local_dir=None):
    """Download model and tokenizer from Hugging Face Hub."""
    try:
        # Login if API key is provided
        if api_key:
            login_to_hub(api_key)
        
        # Set default local directory
        if local_dir is None:
            local_dir = os.path.join("models", repo_name.split("/")[-1])
        
        # Create directory if it doesn't exist
        os.makedirs(local_dir, exist_ok=True)
        
        # Download model and tokenizer
        model = AutoModelForCausalLM.from_pretrained(
            repo_name,
            torch_dtype=torch.float16,
            device_map="auto",
            cache_dir=local_dir
        )
        
        tokenizer = AutoTokenizer.from_pretrained(
            repo_name,
            cache_dir=local_dir
        )
        
        return model, tokenizer, local_dir
    except Exception as e:
        raise Exception(f"Failed to download from Hub: {str(e)}") 