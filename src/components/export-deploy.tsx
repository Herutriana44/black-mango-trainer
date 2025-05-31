'use client';

import { useState } from 'react';
import { exportModel } from '@/lib/api';

export function ExportDeploy() {
    const [isExporting, setIsExporting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [exportFormat, setExportFormat] = useState('onnx');

    const handleExport = async () => {
        try {
            setIsExporting(true);
            setError(null);

            const blob = await exportModel('current');

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `model-${exportFormat}.${exportFormat}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to export model');
            console.error('Export error:', err);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Export & Deploy Model</h2>

            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium mb-4">Export Model</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Export Format</label>
                            <select
                                value={exportFormat}
                                onChange={(e) => setExportFormat(e.target.value)}
                                className="w-full p-2 border rounded bg-gray-800 text-white"
                            >
                                <option value="onnx">ONNX</option>
                                <option value="pt">PyTorch</option>
                                <option value="h5">TensorFlow</option>
                            </select>
                        </div>

                        <button
                            onClick={handleExport}
                            disabled={isExporting}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed"
                        >
                            {isExporting ? 'Exporting...' : 'Export Model'}
                        </button>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium mb-4">Deploy Model</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Deployment Target</label>
                            <select
                                className="w-full p-2 border rounded bg-gray-800 text-white"
                                disabled
                            >
                                <option value="local">Local Server</option>
                                <option value="cloud">Cloud Platform</option>
                                <option value="edge">Edge Device</option>
                            </select>
                        </div>

                        <button
                            className="px-4 py-2 bg-gray-500 text-white rounded cursor-not-allowed"
                            disabled
                        >
                            Deploy Model (Coming Soon)
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500 rounded text-red-500">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
} 