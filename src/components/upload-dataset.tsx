'use client';

import { useState } from 'react';
import { uploadFile } from '@/lib/api';

export function UploadDataset() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
            setError(null);
            setUploadSuccess(false);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        try {
            setIsUploading(true);
            setError(null);
            const response = await uploadFile(selectedFile);
            console.log('Upload successful:', response);
            setUploadSuccess(true);
            setSelectedFile(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to upload file');
            console.error('Upload error:', err);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Upload Dataset</h2>

            <div className="space-y-6">
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-8">
                    <div className="text-center">
                        <input
                            type="file"
                            onChange={handleFileChange}
                            accept=".csv,.json,.txt"
                            className="hidden"
                            id="file-upload"
                        />
                        <label
                            htmlFor="file-upload"
                            className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Choose File
                        </label>
                        <p className="mt-2 text-sm text-gray-400">
                            {selectedFile ? selectedFile.name : 'No file selected'}
                        </p>
                    </div>
                </div>

                {selectedFile && (
                    <div className="flex justify-center">
                        <button
                            onClick={handleUpload}
                            disabled={isUploading}
                            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed"
                        >
                            {isUploading ? 'Uploading...' : 'Upload Dataset'}
                        </button>
                    </div>
                )}

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500 rounded text-red-500">
                        {error}
                    </div>
                )}

                {uploadSuccess && (
                    <div className="p-4 bg-green-500/10 border border-green-500 rounded text-green-500">
                        Dataset uploaded successfully!
                    </div>
                )}
            </div>
        </div>
    );
} 