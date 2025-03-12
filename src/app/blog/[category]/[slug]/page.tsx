import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getPostBySlug, getRelatedPosts, formatCategoryName } from "@/lib/blog";
import BlogPostContent from "@/components/blog/blogPostContent";
import "@/styles/blog.css";

// Use the correct types from Next.js
export default async function BlogPostPage({
  params,
}: {
  params: { category: string; slug: string };
}) {
  const { category, slug } = params;
  const post = await getPostBySlug(slug, category);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post, 3);
  const formattedCategory = formatCategoryName(category);
  const postDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-10">
        <div className="mb-4">
          <a
            href={`/blog/${category}`}
            className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
          >
            {formattedCategory}
          </a>
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
          {post.title}
        </h1>

        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-6">
          <span>{post.author}</span>
          <span className="mx-2">•</span>
          <time dateTime={post.date}>{postDate}</time>
        </div>

        {post.featuredImage && (
          <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
      </div>

      {/* Content */}
      <BlogPostContent post={post} />

      {/* Tags */}
      <div className="max-w-4xl mx-auto mt-10">
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full text-sm"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Related Articles
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {relatedPosts.map((related) => (
              <a
                key={related.slug}
                href={`/blog/${related.category}/${related.slug}`}
                className="group"
              >
                <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
                  <Image
                    src={related.featuredImage}
                    alt={related.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {related.title}
                </h3>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
