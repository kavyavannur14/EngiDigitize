import React, { useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { ProcessingView } from './components/ProcessingView';
import { ResultsView } from './components/ResultsView';
import { processEngineeringDrawing } from './services/geminiService';
import type { AppStatus, ProcessedData } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>('idle');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileUpload = useCallback(async (file: File) => {
    setStatus('processing');
    setUploadedFile(file);
    setUploadedFileUrl(URL.createObjectURL(file));
    setError(null);
    setProcessedData(null);

    try {
      const base64Image = await fileToBase64(file);
      const mimeType = file.type;
      
      const result = await processEngineeringDrawing(base64Image, mimeType);
      
      setProcessedData(result);
      setStatus('success');
    } catch (err) {
      console.error(err);
      setError('Failed to process the drawing. The AI model might be unable to interpret this file. Please try another one.');
      setStatus('error');
    }
  }, []);

  const handleReset = useCallback(() => {
    setStatus('idle');
    setUploadedFile(null);
    if (uploadedFileUrl) {
      URL.revokeObjectURL(uploadedFileUrl);
    }
    setUploadedFileUrl(null);
    setProcessedData(null);
    setError(null);
  }, [uploadedFileUrl]);

  const renderContent = () => {
    switch (status) {
      case 'idle':
      case 'error':
        return <FileUpload onFileUpload={handleFileUpload} error={error} />;
      case 'processing':
        return <ProcessingView />;
      case 'success':
        if (!uploadedFileUrl || !processedData) {
            handleReset();
            return null;
        }
        return (
          <ResultsView
            originalImageUrl={uploadedFileUrl}
            processedData={processedData}
            fileName={uploadedFile?.name || 'drawing'}
            onReset={handleReset}
          />
        );
      default:
        return <FileUpload onFileUpload={handleFileUpload} error={error} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-6xl text-center mb-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-cyan-400">EngiDigitize</h1>
        <p className="text-gray-400 mt-2 text-lg">
          Automated Drawing & Datasheet Conversion using Gen-AI
        </p>
      </header>
      <main className="w-full max-w-6xl flex-grow flex items-center justify-center">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
