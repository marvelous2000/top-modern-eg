"use client"

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { Loader2, UploadCloud, X } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface SingleImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  disabled?: boolean;
}

export function SingleImageUpload({ value, onChange, disabled }: SingleImageUploadProps) {
  const [loading, setLoading] = useState(false);
  const supabase = createSupabaseBrowserClient();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setLoading(true);

    try {
      // 1. Upload the image to Supabase Storage
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error: uploadError } = await supabase.storage
        .from('uploads') // Use the 'uploads' bucket as per SUPABASE_SETUP.md
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // 2. Get the public URL of the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(data.path);

      // 3. Notify the parent component of the new URL
      onChange(publicUrl);
    } catch (error: any) {
      console.error('Error uploading image:', error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [supabase, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.svg'] },
    multiple: false,
    disabled: disabled || loading,
  });

  const handleRemoveImage = () => {
    onChange(null);
  };

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative group w-full h-40 rounded-lg overflow-hidden border">
          <Image
            src={value}
            alt="Uploaded logo"
            layout="fill"
            objectFit="contain"
          />
          {!disabled && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100"
              onClick={handleRemoveImage}
              disabled={loading}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors
            ${isDragActive ? 'border-accent bg-accent/10' : 'border-border hover:border-accent/70'}
            ${(disabled || loading) ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          {loading ? (
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          ) : (
            <UploadCloud className="h-8 w-8 text-muted-foreground" />
          )}
          <p className="mt-2 text-sm text-muted-foreground">
            {loading ? 'Uploading...' : isDragActive ? 'Drop image here' : 'Click or drag to upload'}
          </p>
        </div>
      )}
    </div>
  );
}
