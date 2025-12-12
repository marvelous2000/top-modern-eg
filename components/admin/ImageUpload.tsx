"use client"

import React, { useState, useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { UploadCloud, X, Image as ImageIcon } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  initialImages?: string[] // URLs of images already associated with the product
  onImagesChange: (imageFiles: File[], imageUrls: string[]) => void
  disabled?: boolean
}

export function ImageUpload({ initialImages = [], onImagesChange, disabled }: ImageUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>(initialImages)

  useEffect(() => {
    // This effect handles changes to initialImages from the parent,
    // ensuring the component reflects the product's actual images when editing
    setExistingImageUrls(initialImages);
  }, [initialImages]);

  // Generate preview URLs for newly selected files
  useEffect(() => {
    const urls = selectedFiles.map(file => URL.createObjectURL(file))
    setPreviewUrls(urls)
    // Clean up URLs when component unmounts or files change
    return () => urls.forEach(url => URL.revokeObjectURL(url))
  }, [selectedFiles])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedFiles(prev => [...prev, ...acceptedFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    disabled: disabled,
    multiple: true,
  })

  const handleRemoveNewImage = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(newFiles)
  }

  const memoizedOnImagesChange = useCallback(onImagesChange, []);

  const handleRemoveExistingImage = (imageUrl: string) => {
    setExistingImageUrls(prev => prev.filter(url => url !== imageUrl));
  }

  // Notify parent component about current state of images (new files + existing URLs)
  useEffect(() => {
    memoizedOnImagesChange(selectedFiles, existingImageUrls);
  }, [selectedFiles, existingImageUrls, memoizedOnImagesChange]);


  return (
    <div className="space-y-4">
      <Label className="text-sm font-semibold text-foreground">Product Images</Label>
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200
          ${isDragActive ? "border-accent bg-accent/10" : "border-border hover:border-accent/70 hover:bg-muted/50"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <input {...getInputProps()} disabled={disabled} />
        {isDragActive ? (
          <p className="text-accent flex items-center gap-2">
            <UploadCloud className="h-5 w-5" /> Drop the images here ...
          </p>
        ) : (
          <p className="text-muted-foreground flex items-center gap-2">
            <UploadCloud className="h-5 w-5" /> Drag 'n' drop some images here, or click to select files
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-2">JPEG, PNG, WEBP up to 5MB each</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {existingImageUrls.map((url, index) => (
          <div key={`existing-${url}-${index}`} className="relative group w-full h-32 rounded-lg overflow-hidden border border-border">
            <Image
              src={url}
              alt={`Existing product image ${index + 1}`}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-200 group-hover:scale-105"
            />
            {!disabled && (
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveExistingImage(url);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}

        {previewUrls.map((url, index) => (
          <div key={`new-${url}-${index}`} className="relative group w-full h-32 rounded-lg overflow-hidden border border-border">
            <Image
              src={url}
              alt={`New product image ${index + 1}`}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-200 group-hover:scale-105"
            />
            {!disabled && (
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveNewImage(index);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            <Badge className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">New</Badge>
          </div>
        ))}
        {selectedFiles.length === 0 && existingImageUrls.length === 0 && (
          <div className="flex items-center justify-center w-full h-32 text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
            <ImageIcon className="h-8 w-8" />
          </div>
        )}
      </div>
    </div>
  )
}
