import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader, Sparkles, Check, UploadCloud, RotateCw } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { supabase } from '../lib/supabaseClient';
import { useData } from '../contexts/DataContext';

const API_KEY = 'AIzaSyA8RPPcPdVGWC0dUmmAYp_I-LQzsJxx7LY'; // Key provided by the user.

const base64StringToFile = (base64String: string, filename: string, mimeType = 'image/jpeg'): File => {
  const byteCharacters = atob(base64String);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  const blob = new Blob(byteArrays, { type: mimeType });
  return new File([blob], filename, { type: mimeType });
};

const aspectRatios = [
  { label: 'Landscape', value: '16:9' },
  { label: 'Portrait', value: '3:4' },
  { label: 'Square', value: '1:1' },
];

const loadingMessages = [
  "Generating with AI...",
  "Contacting the creative muses...",
  "Polishing the pixels...",
  "Almost there...",
  "Finalizing the masterpiece..."
];

const ImageGeneratorModal = ({ path, closeModal }: { path: string; closeModal: () => void }) => {
  const { updateDraftData } = useData();
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);

  useEffect(() => {
    let interval: number;
    if (isGenerating) {
      interval = window.setInterval(() => {
        setLoadingMessage(prev => {
          const currentIndex = loadingMessages.indexOf(prev);
          const nextIndex = (currentIndex + 1) % loadingMessages.length;
          return loadingMessages[nextIndex];
        });
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);


  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt.");
      return;
    }
    if (!API_KEY) {
      console.error("Gemini API key is not configured. Image generation will not work.");
      setError("Gemini API key is not configured.");
      return;
    }
    setIsGenerating(true);
    setError('');
    setGeneratedImage(null);
    setLoadingMessage(loadingMessages[0]);

    try {
      // Initialize the Google AI client here, just before use, to prevent app crash on load.
      const ai = new GoogleGenAI({ apiKey: API_KEY });

      const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: aspectRatio as "1:1" | "3:4" | "4:3" | "9:16" | "16:9",
        },
      });
      const base64ImageBytes = response.generatedImages[0]?.image?.imageBytes;
      if (!base64ImageBytes) {
          throw new Error("API did not return an image.");
      }
      setGeneratedImage(base64ImageBytes);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      console.error('Error generating image:', errorMessage);
      setError(`Failed to generate image: ${errorMessage}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAccept = async () => {
    if (!generatedImage) return;

    setIsUploading(true);
    setError('');
    try {
      const file = base64StringToFile(generatedImage, `ai-generated-${Date.now()}.jpg`);
      const filePath = `public/${file.name}`;

      let { error: uploadError } = await supabase.storage
        .from('latikpublicidad')
        .upload(filePath, file);

      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage.from('latikpublicidad').getPublicUrl(filePath);
      if (!data.publicUrl) throw new Error("Could not get public URL for uploaded image.");

      updateDraftData(path, data.publicUrl);
      closeModal();
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
        console.error('Error uploading generated image:', errorMessage);
        setError(`Failed to save image: ${errorMessage}`);
    } finally {
        setIsUploading(false);
    }
  };

  const handleRetry = () => {
    setGeneratedImage(null);
    setError('');
  };

  return (
    <motion.div
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={closeModal}
    >
      <motion.div 
        className="w-full max-w-2xl bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 relative flex flex-col gap-6"
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start">
            <div>
                <h2 className="text-2xl font-bold text-[var(--color-primary)] flex items-center gap-3">
                    <Sparkles/> Generate Image with AI
                </h2>
                <p className="text-sm text-slate-400 mt-1">Describe the image you want to create.</p>
            </div>
            <button onClick={closeModal} className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-slate-100 transition-colors">
              <X size={24}/>
            </button>
        </div>
        
        <div className="flex-grow min-h-[250px] flex items-center justify-center bg-slate-900/50 rounded-lg border border-slate-700 p-4">
             <AnimatePresence mode="wait">
                {isGenerating ? (
                    <motion.div key="loading" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="text-center">
                        <Loader className="animate-spin text-[var(--color-primary)] mx-auto" size={40} />
                        <p className="mt-4 font-semibold text-slate-200">{loadingMessage}</p>
                    </motion.div>
                ) : generatedImage ? (
                    <motion.div key="result" initial={{opacity: 0, scale: 0.9}} animate={{opacity: 1, scale: 1}} className="w-full">
                        <img src={`data:image/jpeg;base64,${generatedImage}`} alt="AI generated" className="max-h-[300px] w-auto mx-auto rounded-md shadow-lg" />
                    </motion.div>
                ) : (
                    <motion.div key="form" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="w-full flex flex-col gap-4">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="w-full h-28 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
                            placeholder="e.g., 'A vibrant, energetic photo of a university graduation party, race car theme, checkered flags, champagne spray, dynamic lighting'"
                        />
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-2">Aspect Ratio</label>
                            <div className="flex gap-2">
                                {aspectRatios.map(ratio => (
                                    <button 
                                        key={ratio.value} 
                                        onClick={() => setAspectRatio(ratio.value)}
                                        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${aspectRatio === ratio.value ? 'bg-[var(--color-primary)] text-slate-900' : 'bg-slate-700 hover:bg-slate-600'}`}
                                    >
                                        {ratio.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {error && <p className="text-red-400 text-center text-sm -my-2">{error}</p>}

        <div className="flex justify-end items-center gap-4">
            {generatedImage && !isGenerating ? (
                <>
                    <button onClick={handleRetry} disabled={isUploading} className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-slate-100 font-bold py-2 px-4 rounded-lg transition-colors">
                        <RotateCw size={16} /> Generate Again
                    </button>
                     <button onClick={handleAccept} disabled={isUploading} className="w-48 flex justify-center items-center gap-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        {isUploading ? <><Loader size={16} className="animate-spin" /><span>Saving...</span></> : <><Check size={16} /><span>Accept & Use Image</span></>}
                    </button>
                </>
            ) : (
                <button onClick={handleGenerate} disabled={isGenerating || !prompt.trim()} className="w-48 flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--color-primary-gradient-from)] to-[var(--color-primary-gradient-to)] text-slate-900 font-bold py-2 px-4 rounded-lg shadow-lg shadow-[var(--color-primary)]/30 disabled:opacity-50 transition-opacity">
                    <Sparkles size={16} /> Generate
                </button>
            )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ImageGeneratorModal;