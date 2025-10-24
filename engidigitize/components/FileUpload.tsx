import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  error: string | null;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, error }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  }, [onFileUpload]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl text-center">
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center w-full h-80 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300
                    ${isDragging ? 'border-cyan-400 bg-gray-700' : 'border-gray-600 bg-gray-800 hover:border-gray-500 hover:bg-gray-700'}`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <UploadIcon className="w-12 h-12 mb-4 text-gray-400" />
          <p className="mb-2 text-lg text-gray-400">
            <span className="font-semibold text-cyan-400">Click to upload</span> or drag and drop
          </p>
          <p className="text-sm text-gray-500">PNG, JPG, or PDF</p>
        </div>
        <input
          id="dropzone-file"
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileChange}
          accept="image/png, image/jpeg, application/pdf"
        />
      </div>
      {error && (
        <div className="mt-4 p-3 bg-red-900/50 border border-red-700 text-red-300 rounded-lg">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}
    </div>
  );
};
