import React, { useState } from 'react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
  fallbackSubtitle?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = '',
  fallbackTitle = 'Noor Quran Academy',
  fallbackSubtitle = 'Classical Manuscript & Phonetic Study'
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#14261F] via-[#0B5D46] to-[#1A382E] p-6 text-center text-[#FAF9F5] ${className}`}
        role="img"
        aria-label={alt}
      >
        <svg
          className="mb-3 h-12 w-12 text-[#D4AF37]/80"
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <polygon points="32,4 39,22 58,22 43,34 48,52 32,41 16,52 21,34 6,22 25,22" />
          <circle cx="32" cy="32" r="18" strokeOpacity="0.4" />
        </svg>
        <p className="font-display text-base font-semibold tracking-tight text-white">
          {fallbackTitle}
        </p>
        <p className="mt-1 text-xs text-[#D5E2DC]">{fallbackSubtitle}</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
