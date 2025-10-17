
import React, { useState, useCallback, useEffect } from 'react';
import type { Generation, GenerationRequest } from '../types';
import Layout from './Layout';
import ImageUploader from './ImageUploader';
import { useGeneration } from '../hooks/useGeneration';
// FIX: Import MAX_RETRIES from constants to resolve undefined variable error.
import { STYLE_OPTIONS, MAX_RETRIES } from '../constants';
import Button from './Button';
import Spinner from './Spinner';
import HistoryPanel from './HistoryPanel';
import Alert from './Alert';

const StudioPage: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [prompt, setPrompt] = useState<string>('');
    const [style, setStyle] = useState(STYLE_OPTIONS[0]);
    
    const { status, error, result, retryCount, generate, abort, reset } = useGeneration();

    const [lastSuccessfulGeneration, setLastSuccessfulGeneration] = useState<Generation | null>(null);

    useEffect(() => {
        if (status === 'success' && result) {
            setLastSuccessfulGeneration(result);
        }
    }, [status, result]);

    const handleGenerate = async () => {
        if (!prompt || !imageFile) {
            alert("Please provide an image and a prompt.");
            return;
        }
        const requestData: GenerationRequest = { prompt, style, image: imageFile };
        try {
            await generate(requestData);
        } catch (e) {
            // Error is handled in the hook, this catch is to prevent unhandled promise rejections
            console.error(e);
        }
    };

    const handleRestoreGeneration = useCallback((generation: Generation) => {
        reset();
        setPrompt(generation.prompt);
        setStyle(generation.style);
        setLastSuccessfulGeneration(generation);
        // We can't restore the file, so we show the generated image as preview
        setPreview(generation.imageUrl); 
        setImageFile(null); // Clear the file input
    }, [reset]);

    const isProcessing = status === 'loading' || status === 'retrying';
    const displayImage = lastSuccessfulGeneration ? lastSuccessfulGeneration.imageUrl : preview;

    const getStatusMessage = () => {
        if (status === 'loading') return "Generating your creation...";
        if (status === 'retrying') return `Model overloaded. Retrying... (${retryCount}/${MAX_RETRIES})`;
        if (status === 'aborted') return "Generation aborted.";
        return "Your generation will appear here";
    };

    return (
        <Layout>
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Main Studio Panel */}
                <div className="flex-grow lg:w-2/3 bg-brand-secondary p-6 rounded-lg shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Side: Uploader & Result */}
                        <div className="flex flex-col gap-4">
                            <h2 className="text-xl font-semibold text-brand-text">1. Upload Image</h2>
                            <ImageUploader onFileSelect={setImageFile} onPreview={setPreview} restoredPreview={preview} />
                            <div className="aspect-square bg-brand-primary rounded-md flex items-center justify-center relative overflow-hidden">
                                {isProcessing && (
                                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10 text-center p-4">
                                        <Spinner />
                                        <p className="text-brand-text mt-4">{getStatusMessage()}</p>
                                    </div>
                                )}
                                {displayImage ? (
                                    <img src={displayImage} alt="Generation preview" className="object-cover w-full h-full" />
                                ) : (
                                    <p className="text-brand-text-secondary">{getStatusMessage()}</p>
                                )}
                            </div>
                        </div>

                        {/* Right Side: Controls */}
                        <div className="flex flex-col gap-4">
                            <h2 className="text-xl font-semibold text-brand-text">2. Customize</h2>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="prompt" className="font-medium text-brand-text-secondary">Prompt</label>
                                <textarea
                                    id="prompt"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="e.g., a leather jacket with neon details"
                                    rows={4}
                                    className="w-full bg-brand-primary border border-gray-700 rounded-md p-2 focus:ring-2 focus:ring-brand-accent focus:outline-none transition"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="style" className="font-medium text-brand-text-secondary">Style</label>
                                <select
                                    id="style"
                                    value={style}
                                    onChange={(e) => setStyle(e.target.value as (typeof STYLE_OPTIONS)[0])}
                                    className="w-full bg-brand-primary border border-gray-700 rounded-md p-2 focus:ring-2 focus:ring-brand-accent focus:outline-none transition"
                                >
                                    {STYLE_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
                                </select>
                            </div>
                            <div className="mt-auto flex flex-col gap-3 pt-4">
                                {error && <Alert type="error" message={error} />}
                                {isProcessing ? (
                                    // FIX: Removed redundant 'disabled' prop. The button is only visible during processing,
                                    // and disappears when aborted, so the check was unnecessary and caused a type error.
                                    <Button onClick={abort} variant="danger">
                                        Abort
                                    </Button>
                                ) : (
                                    <Button onClick={handleGenerate} disabled={!imageFile || !prompt}>
                                        Generate
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* History Panel */}
                <div className="lg:w-1/3">
                    <HistoryPanel onRestore={handleRestoreGeneration} newGeneration={lastSuccessfulGeneration} />
                </div>
            </div>
        </Layout>
    );
};

export default StudioPage;
