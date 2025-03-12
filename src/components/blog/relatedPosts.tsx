// src/components/blog/relatedPosts.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/lib/blog";

interface RelatedPostsProps {
  posts: BlogPost[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6 text-white">Related Articles</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            key={`${post.category}-${post.slug}`}
            href={`/blog/${post.category}/${post.slug}`}
            className="group"
          >
            <div className="bg-[#0A0D2C] rounded-lg shadow-sm overflow-hidden group-hover:shadow-md transition-shadow duration-300 border border-[#1A1F42]">
              <div className="relative h-40 w-full">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Try to fallback to a default image if the main one fails
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes("/img/")) {
                      target.src = "/img/squat.png";
                    } else {
                      target.src = "/squat.png";
                    }
                  }}
                />
              </div>

              <div className="p-4">
                <h3 className="font-bold mb-2 line-clamp-2 text-white group-hover:text-[#FF6500] transition-colors duration-200">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-500">{post.date}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
