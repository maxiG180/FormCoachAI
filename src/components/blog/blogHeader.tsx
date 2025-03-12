// src/components/blog/blogHeader.tsx
import Image from "next/image";
import Link from "next/link";
import { formatCategoryName } from "@/lib/blog";

interface BlogHeaderProps {
  title: string;
  category: string;
  date: string;
  author: string;
  featuredImage: string;
}

export default function BlogHeader({
  title,
  category,
  featuredImage,
}: BlogHeaderProps) {
  const categoryDisplay = category ? formatCategoryName(category) : "";

  // Use a default image as fallback
  const defaultImage = "/img/default-blog-image.jpg";
  const imageSrc = featuredImage || defaultImage;

  return (
    <div className="mb-8">
      <Link
        href={`/blog/${category}`}
        className="inline-block px-3 py-1 bg-[#1A1F42] text-[#FF6500] rounded-md mb-4 text-sm hover:bg-[#FF6500]/20 transition-colors"
      >
        {categoryDisplay}
      </Link>
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white leading-tight">
        {title}
      </h1>
      <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-8">
        <Image
          src={imageSrc}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
