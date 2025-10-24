import React, { useState, useEffect } from 'react';
import { SpinnerIcon } from './icons/SpinnerIcon';

const processingSteps = [
    'Initializing AI pipeline...',
    'Analyzing document layout...',
    'Performing Optical Character Recognition (OCR)...',
    'Structuring data with Generative AI...',
    'Converting raster to vector drawing...',
    'Finalizing outputs...',
];

export const ProcessingView: React.FC = () => {
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(processingSteps[0]);

    useEffect(() => {
        const totalDuration = 15000; // 15 seconds for simulation
        const stepDuration = totalDuration / processingSteps.length;

        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + 1;
            });
        }, totalDuration / 100);

        let stepIndex = 0;
        const stepInterval = setInterval(() => {
            stepIndex++;
            if (stepIndex < processingSteps.length) {
                setCurrentStep(processingSteps[stepIndex]);
            } else {
                clearInterval(stepInterval);
            }
        }, stepDuration);

        return () => {
            clearInterval(progressInterval);
            clearInterval(stepInterval);
        };
    }, []);

    return (
        <div className="w-full max-w-2xl text-center p-8 bg-gray-800 rounded-lg shadow-2xl border border-gray-700">
            <SpinnerIcon className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-white mb-4">Processing Drawing</h2>
            <p className="text-gray-400 mb-6">{currentStep}</p>
            <div className="w-full bg-gray-700 rounded-full h-4">
                <div
                    className="bg-cyan-500 h-4 rounded-full transition-all duration-150 ease-linear"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <p className="text-cyan-300 font-mono text-xl mt-4">{progress}%</p>
            <p className="text-sm text-gray-500 mt-2">This should complete in under 120 seconds.</p>
        </div>
    );
};
