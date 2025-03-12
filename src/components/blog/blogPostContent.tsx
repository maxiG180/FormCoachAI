import React from "react";
import { BlogPost } from "@/lib/blog";

interface BlogPostContentProps {
  post: BlogPost;
}

const BlogPostContent: React.FC<BlogPostContentProps> = ({ post }) => {
  // Process content with enhanced formatting if needed
  let processedContent = post.content;

  return (
    <article className="max-w-4xl mx-auto prose prose-lg lg:prose-xl dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:text-blue-800 dark:hover:prose-a:text-blue-300 prose-img:rounded-lg">
      <div
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: processedContent }}
      />
    </article>
  );
};

export default BlogPostContent;
