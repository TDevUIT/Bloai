"use client"

import React, { useState, useCallback, useRef } from 'react'
import { UploadIcon } from 'lucide-react' 

interface DropzoneProps {
  onDrop: (files: File[]) => void
  accept?: string
  maxFiles?: number
  maxSize?: number
}

export const Dropzone = ({ onDrop, accept, maxFiles, maxSize }: DropzoneProps) => {
  const [isDragActive, setIsDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const processFiles = useCallback((files: FileList | null) => {
      if (!files) return;

      let fileArray = Array.from(files);
      let acceptedFiles: File[] = [];
      const acceptedTypes = accept ? accept.split(',').map(type => type.trim()) : null;

      for (const file of fileArray) {
          const isTypeAccepted = !acceptedTypes || acceptedTypes.some(type => {
              if (type.startsWith('.')) {
                  return file.name.toLowerCase().endsWith(type.toLowerCase());
              }
              if (type.endsWith('/*')) {
                  return file.type.startsWith(type.slice(0, -1));
              }
              return file.type === type; 
          });

          const isSizeAccepted = !maxSize || file.size <= maxSize;

          if (isTypeAccepted && isSizeAccepted) {
              acceptedFiles.push(file);
          } else if (!isTypeAccepted) {
              console.warn(`File ${file.name} rejected: Invalid type (${file.type})`);
             
          } else if (!isSizeAccepted) {
               console.warn(`File ${file.name} rejected: Exceeds size limit (${file.size} > ${maxSize})`);
          }
      }


      if (maxFiles) {
          acceptedFiles = acceptedFiles.slice(0, maxFiles);
      }

      if (acceptedFiles.length > 0) {
          onDrop(acceptedFiles);
      }
  }, [accept, maxFiles, maxSize, onDrop]); 

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true)
    } else if (e.type === 'dragleave') {
       if (e.relatedTarget && (e.target as Node).contains(e.relatedTarget as Node)) {
           return;
       }
       setIsDragActive(false);
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) { 
      processFiles(e.dataTransfer.files)
    }
  }, [processFiles]) 

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      processFiles(e.target.files);
      if(e.target) e.target.value = '';
  }, [processFiles]);

  const displayAccept = accept
    ? accept.split(',')
        .map(type => type.trim().replace('image/', '').toUpperCase())
        .join(', ')
    : 'any';

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 md:p-8 text-center transition-colors duration-200 ease-in-out cursor-pointer flex flex-col justify-center items-center min-h-[150px] md:min-h-[200px] ${
        isDragActive
          ? 'border-primary bg-primary/10 ring-2 ring-primary ring-offset-2'
          : 'border-muted-foreground/30 hover:border-muted-foreground/50 hover:bg-muted/10' 
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      role="button" 
      aria-label="File Upload Dropzone"
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        multiple={maxFiles ? maxFiles > 1 : false} 
        onChange={handleInputChange}
      />
      <div className="flex flex-col items-center justify-center gap-2 pointer-events-none"> 
        <UploadIcon className="h-8 w-8 text-muted-foreground mb-2" /> 
        <p className="text-sm font-medium text-foreground"> 
          Kéo thả ảnh hoặc <span className='text-primary'>chọn file</span>
        </p>
        <p className="text-xs text-muted-foreground/80">
          Định dạng: {displayAccept}
        </p>
        {maxSize && (
             <p className="text-xs text-muted-foreground/80">
                Tối đa: {(maxSize / (1024 * 1024)).toFixed(1)}MB
             </p>
        )}
      </div>
    </div>
  )
}

interface DropzoneProps {
  onDrop: (files: File[]) => void;
  accept?: string; 
  maxFiles?: number;
  maxSize?: number;
  id?: string;
  'aria-label'?: string; 
}