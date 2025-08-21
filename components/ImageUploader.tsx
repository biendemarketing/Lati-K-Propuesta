


import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { useData } from '../contexts/DataContext';
import { UploadCloud, Loader, Sparkles } from 'lucide-react';
import ImageGeneratorModal from './ImageGeneratorModal';
import { ai, aiInitializationError } from '../lib/aiClient';

const ImageUploader = ({ path, currentImageUrl }: { path: string; currentImageUrl: string }) => {
  const { updateDraftData } = useData();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setError('');
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `public/${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from('latikpublicidad')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }
      
      const { data } = supabase.storage.from('latikpublicidad').getPublicUrl(filePath);
      
      if (!data.publicUrl) {
          throw new Error("Could not get public URL for uploaded image.");
      }

      updateDraftData(path, data.publicUrl);

    } catch (error) {
      if (error instanceof Error) {
        console.error('Error uploading image:', error.message);
        if (error.message.includes('security policy')) {
            setError('Permission Denied: Check Storage RLS policies in Supabase for inserts.');
        } else {
            setError(error.message);
        }
      } else {
        setError('An unknown error occurred during upload.');
      }
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="mb-2">
        <label className="block text-xs font-medium text-slate-400 mb-1">Image</label>
        <div className="flex items-center gap-2">
            {currentImageUrl && <img src={currentImageUrl} alt="Current" className="w-16 h-16 object-cover rounded-md border-2 border-slate-600"/>}
            <div className="flex-grow grid grid-cols-2 gap-2">
              <button
                  className="relative w-full h-16 border-2 border-dashed border-slate-600 rounded-md flex flex-col justify-center items-center text-slate-400 hover:border-slate-400 hover:text-slate-300 cursor-pointer transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
              >
                  {uploading ? (
                      <>
                          <Loader className="animate-spin" size={24} />
                          <span className="text-xs mt-1">Subiendo...</span>
                      </>
                  ) : (
                      <>
                          <UploadCloud size={24} />
                          <span className="text-xs mt-1">Cambiar imagen</span>
                      </>
                  )}
                  <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleUpload}
                      disabled={uploading}
                      className="hidden"
                  />
              </button>
              <button
                  className="relative w-full h-16 border-2 border-dashed border-slate-600 rounded-md flex flex-col justify-center items-center text-slate-400 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] cursor-pointer transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-600 disabled:hover:text-slate-400"
                  onClick={() => ai && setIsGeneratorOpen(true)}
                  disabled={uploading || !ai}
                  title={!ai ? `AI features disabled: ${aiInitializationError}` : "Generate image with AI"}
              >
                  <Sparkles size={24} className="group-hover:scale-125 group-hover:animate-pulse transition-transform" />
                  <span className="text-xs mt-1 font-semibold">Generar con IA</span>
              </button>
            </div>
        </div>
        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
        <AnimatePresence mode="wait">
            {isGeneratorOpen && (
                <ImageGeneratorModal 
                    path={path} 
                    closeModal={() => setIsGeneratorOpen(false)}
                />
            )}
        </AnimatePresence>
    </div>
  );
};

export default ImageUploader;