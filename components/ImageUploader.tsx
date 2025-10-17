
import React, { useCallback, useState, useEffect } from 'react';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_MB } from '../constants';

interface ImageUploaderProps {
  onFileSelect: (file: File | null) => void;
  onPreview: (previewUrl: string | null) => void;
  restoredPreview: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onFileSelect, onPreview, restoredPreview }) => {
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    // When a generation is restored, the parent component passes a preview URL.
    // If we have a restored preview, it means we don't have a file, so clear local file-related state.
    if(restoredPreview) {
       onFileSelect(null);
       setError(null);
    }
  }, [restoredPreview, onFileSelect]);

  const handleFile = useCallback((file: File | null) => {
    setError(null);
    if (!file) {
      onFileSelect(null);
      onPreview(null);
      return;
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError(`Invalid file type. Please use JPG or PNG.`);
      onFileSelect(null);
      onPreview(null);
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(`File is too large. Max size is ${MAX_FILE_SIZE_MB}MB.`);
      onFileSelect(null);
      onPreview(null);
      return;
    }
    
    onFileSelect(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      onPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, [onFileSelect, onPreview]);

  const onDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const onDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const onDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div>
        <label
            htmlFor="file-upload"
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
            className={`flex justify-center w-full h-32 px-4 transition bg-brand-primary border-2 ${isDragging ? 'border-brand-accent' : 'border-gray-700'} border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-500 focus:outline-none`}
        >
            <span className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-brand-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="font-medium text-brand-text-secondary">
                    Drop files to attach, or&nbsp;
                    <span className="text-brand-accent underline">browse</span>
                </span>
            </span>
            <input id="file-upload" type="file" name="file_upload" className="hidden" accept={ALLOWED_FILE_TYPES.join(',')} onChange={onFileChange}/>
        </label>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default ImageUploader;
