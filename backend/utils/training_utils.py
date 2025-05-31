import torch
from transformers import Trainer, TrainingArguments
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
from datasets import Dataset
import pandas as pd
import os

def prepare_model_for_training(model, config):
    """Prepare model for fine-tuning based on the specified method."""
    if config['finetune_type'] == 'lora':
        lora_config = LoraConfig(
            r=config.get('lora_r', 16),
            lora_alpha=config.get('lora_alpha', 32),
            target_modules=config.get('target_modules', ['q_proj', 'v_proj']),
            lora_dropout=config.get('lora_dropout', 0.05),
            bias="none",
            task_type="CAUSAL_LM"
        )
        return get_peft_model(model, lora_config)
    
    elif config['finetune_type'] == 'qlora':
        model = prepare_model_for_kbit_training(model)
        lora_config = LoraConfig(
            r=config.get('lora_r', 16),
            lora_alpha=config.get('lora_alpha', 32),
            target_modules=config.get('target_modules', ['q_proj', 'v_proj']),
            lora_dropout=config.get('lora_dropout', 0.05),
            bias="none",
            task_type="CAUSAL_LM"
        )
        return get_peft_model(model, lora_config)
    
    elif config['finetune_type'] == 'sft':
        # For SFT, we use the base model with custom training arguments
        return model
    
    elif config['finetune_type'] == 'dpo':
        # For DPO, we need to prepare the model for preference learning
        return model
    
    else:  # Full fine-tuning
        return model

def get_training_arguments(config, output_dir):
    """Get training arguments based on configuration."""
    return TrainingArguments(
        output_dir=output_dir,
        num_train_epochs=config.get('epochs', 3),
        per_device_train_batch_size=config.get('batch_size', 4),
        learning_rate=config.get('learning_rate', 2e-4),
        max_grad_norm=config.get('max_grad_norm', 0.3),
        warmup_ratio=config.get('warmup_ratio', 0.03),
        logging_steps=config.get('logging_steps', 10),
        save_strategy="epoch",
        evaluation_strategy="epoch" if config.get('validation_split', 0) > 0 else "no",
        load_best_model_at_end=True if config.get('validation_split', 0) > 0 else False,
        metric_for_best_model="eval_loss" if config.get('validation_split', 0) > 0 else None,
        greater_is_better=False if config.get('validation_split', 0) > 0 else None,
        fp16=torch.cuda.is_available(),
        report_to="tensorboard"
    )

def prepare_dataset(file_path, tokenizer, config):
    """Prepare dataset for training."""
    # Read dataset
    if file_path.endswith('.csv'):
        df = pd.read_csv(file_path)
    elif file_path.endswith('.xlsx'):
        df = pd.read_excel(file_path)
    else:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        df = pd.DataFrame({'text': [content]})
    
    # Convert to Hugging Face dataset
    dataset = Dataset.from_pandas(df)
    
    # Tokenize dataset
    def tokenize_function(examples):
        return tokenizer(
            examples['text'],
            padding='max_length',
            truncation=True,
            max_length=config.get('max_length', 512)
        )
    
    tokenized_dataset = dataset.map(
        tokenize_function,
        batched=True,
        remove_columns=dataset.column_names
    )
    
    # Split dataset if validation split is specified
    if config.get('validation_split', 0) > 0:
        split_dataset = tokenized_dataset.train_test_split(
            test_size=config['validation_split']
        )
        return split_dataset['train'], split_dataset['test']
    
    return tokenized_dataset, None

def create_trainer(model, train_dataset, eval_dataset, training_args, tokenizer):
    """Create and return a Trainer instance."""
    return Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=eval_dataset,
        tokenizer=tokenizer
    )

def save_checkpoint(trainer, output_dir, checkpoint_name):
    """Save model checkpoint."""
    checkpoint_path = os.path.join(output_dir, checkpoint_name)
    trainer.save_model(checkpoint_path)
    return checkpoint_path

def load_checkpoint(model, checkpoint_path):
    """Load model from checkpoint."""
    return model.from_pretrained(checkpoint_path) 