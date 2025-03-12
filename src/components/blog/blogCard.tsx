// src/components/blog/blogCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/lib/blog";
import { useState } from "react";
import { formatCategoryName } from "@/lib/blog";

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const [imgError, setImgError] = useState(false);

  // Safe category display that handles undefined
  const categoryDisplay = post.category
    ? formatCategoryName(post.category)
    : "";

  // Format date safely
  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString()
    : "";

  // Default image path
  const defaultImage = "/img/default-blog-image.jpg";

  return (
    <div className="bg-[#0A0D2C] rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-[#1A1F42]">
      <Link href={`/blog/${post.category}/${post.slug}`}>
        <div className="relative h-48 w-full">
          {!imgError && post.featuredImage ? (
            <Image
              src={post.featuredImage}
              alt={post.title || "Blog post"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              onError={() => setImgError(true)}
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400">
              <span>{post.title || "Blog post"}</span>
            </div>
          )}
        </div>

        <div className="p-4">
          {/* Only render category if it exists */}
          {categoryDisplay && (
            <div className="text-sm text-[#FF6500] uppercase tracking-wide font-semibold mb-1">
              {categoryDisplay}
            </div>
          )}

          <h2 className="text-xl font-bold mb-2 line-clamp-2 text-white">
            {post.title || "Untitled Post"}
          </h2>

          {post.excerpt && (
            <p className="text-gray-400 mb-4 line-clamp-3">{post.excerpt}</p>
          )}

          <div className="flex items-center justify-between">
            {formattedDate && (
              <span className="text-sm text-gray-500" suppressHydrationWarning>
                {formattedDate}
              </span>
            )}
            <span className="text-[#FF6500] font-medium">Read more →</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
