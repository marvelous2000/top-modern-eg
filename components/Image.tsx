'use client';

interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function Image({ src, alt, width, height, className }: ImageProps) {
  // Remove any locale prefix from src if present
  const cleanSrc = src.startsWith('/en/') || src.startsWith('/ar/')
    ? src.substring(4) // Remove '/en/' or '/ar/' (4 characters)
    : src;

  return (
    <img
      src={cleanSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={(e) => {
        // Fallback if image fails to load
        console.warn(`Image failed to load: ${cleanSrc}`);
      }}
    />
  );
}
