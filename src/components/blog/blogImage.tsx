// src/components/blog/BlogImage.tsx
"use client";

import Image from "next/image";
import { useState } from "react";

interface BlogImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export default function BlogImage({
  src,
  alt,
  fill = false,
  className = "",
  sizes,
  priority = false,
}: BlogImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  // Handle image loading error
  const handleError = () => {
    // Fallback to a default image
    setImgSrc("/img/squat.png");
  };

  if (fill) {
    return (
      <Image
        src={imgSrc}
        alt={alt}
        fill
        sizes={
          sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        }
        className={className}
        priority={priority}
        onError={handleError}
      />
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={800}
      height={600}
      className={className}
      sizes={sizes}
      priority={priority}
      onError={handleError}
    />
  );
}
