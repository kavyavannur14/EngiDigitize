import React, { useState } from 'react';
import type { ProcessedData } from '../types';
import { JsonIcon } from './icons/JsonIcon';
import { DxfIcon } from './icons/DxfIcon';
import { DownloadIcon } from './icons/DownloadIcon';

interface ResultsViewProps {
  originalImageUrl: string;
  processedData: ProcessedData;
  fileName: string;
  onReset: () => void;
}

type ActiveTab = '1d' | '2d';

export const ResultsView: React.FC<ResultsViewProps> = ({ originalImageUrl, processedData, fileName, onReset }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('1d');
  const [copied, setCopied] = useState(false);

  const formattedJson = (() => {
    try {
      const parsed = JSON.parse(processedData.structuredData);
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      return processedData.structuredData; // Return as is if not valid JSON
    }
  })();

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(formattedJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const baseFileName = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;

  return (
    <div className="w-full max-w-7xl animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BEFORE */}
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-gray-300 mb-4 text-center">Before</h2>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex-grow">
            <img src={originalImageUrl} alt="Original Drawing" className="w-full h-full object-contain max-h-[70vh]"/>
          </div>
        </div>

        {/* AFTER */}
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-gray-300 mb-4 text-center">After (AI Generated)</h2>
          <div className="bg-gray-800 rounded-lg border border-gray-700 flex flex-col flex-grow">
            <div className="flex border-b border-gray-700">
              <TabButton isActive={activeTab === '1d'} onClick={() => setActiveTab('1d')}>
                <JsonIcon className="w-5 h-5 mr-2" /> 1D Data (JSON)
              </TabButton>
              <TabButton isActive={activeTab === '2d'} onClick={() => setActiveTab('2d')}>
                <DxfIcon className="w-5 h-5 mr-2" /> 2D Data (Vector)
              </TabButton>
            </div>
            <div className="p-4 flex-grow h-[60vh] lg:h-auto">
              {activeTab === '1d' && (
                <div className="relative h-full">
                  <button onClick={handleCopy} className="absolute top-2 right-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors">{copied ? 'Copied!' : 'Copy'}</button>
                  <pre className="h-full w-full overflow-auto bg-gray-900/50 p-4 rounded text-sm text-cyan-300 whitespace-pre-wrap break-all">
                    <code>{formattedJson}</code>
                  </pre>
                </div>
              )}
              {activeTab === '2d' && (
                <div className="h-full w-full bg-white rounded flex items-center justify-center p-2">
                    <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: processedData.vectorDrawing }} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <ActionButton onClick={() => downloadFile(formattedJson, `${baseFileName}.json`, 'application/json')}>
          <DownloadIcon className="w-5 h-5 mr-2" /> Download JSON
        </ActionButton>
        <ActionButton onClick={() => downloadFile(processedData.vectorDrawing, `${baseFileName}.dxf`, 'image/svg+xml')}>
          <DownloadIcon className="w-5 h-5 mr-2" /> Download DXF
        </ActionButton>
        <button onClick={onReset} className="px-6 py-3 font-semibold text-gray-400 hover:text-white transition-colors">
          Start Over
        </button>
      </div>
    </div>
  );
};


interface TabButtonProps {
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode;
}
const TabButton: React.FC<TabButtonProps> = ({ isActive, onClick, children }) => (
    <button
        onClick={onClick}
        className={`flex-1 flex items-center justify-center px-4 py-3 font-medium text-sm transition-colors
        ${isActive ? 'bg-gray-700 text-cyan-400' : 'bg-transparent text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'}`}
    >
        {children}
    </button>
);

const ActionButton: React.FC<{onClick: () => void; children: React.ReactNode}> = ({onClick, children}) => (
    <button onClick={onClick} className="w-full sm:w-auto flex items-center justify-center bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105">
        {children}
    </button>
);
