// src/app/blog/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import BlogCard from "@/components/blog/blogCard";
import CategoryList from "@/components/blog/categoryList";
import { getAllPosts, getCategories } from "@/lib/blog";
import { Search } from "lucide-react";

export const metadata: Metadata = {
  title: "FormCoachAI Blog | AI-Powered Workout Form Analysis",
  description:
    "Improve your workout form with insights from AI technology, fitness tips, and expert advice on proper exercise technique.",
  openGraph: {
    title: "FormCoachAI Blog | AI-Powered Workout Form Analysis",
    description:
      "Discover AI-powered workout form analysis tips and techniques to improve your fitness results.",
    images: ["/img/blog-og-image.jpg"],
  },
};

export default async function BlogPage() {
  const allPosts = await getAllPosts();
  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
          FormCoachAI Blog
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Expert insights on workout form, AI technology, and fitness tips to
          help you train smarter and prevent injuries.
        </p>
      </div>

      {/* Search (you'll need to implement functionality) */}
      <div className="mb-12 max-w-2xl mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Search articles..."
            className="w-full px-4 py-3 pl-12 bg-[#1A1F42]/50 border border-[#1A1F42] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FF6500]/50"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Categories filter */}
      <div className="mb-8 flex flex-wrap gap-3">
        <Link
          href="/blog"
          className="px-4 py-2 rounded-full text-sm bg-[#FF6500]/20 text-[#FF6500] transition-colors"
        >
          All
        </Link>
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/blog/${category.slug}`}
            className="px-4 py-2 rounded-full text-sm bg-[#1A1F42] text-gray-300 hover:bg-[#FF6500]/20 hover:text-[#FF6500] transition-colors"
          >
            {category.name}
          </Link>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <div className="lg:w-3/4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {allPosts.map((post) => (
              <BlogCard key={`${post.category}-${post.slug}`} post={post} />
            ))}
          </div>

          {/* No posts message if needed */}
          {allPosts.length === 0 && (
            <div className="text-center py-16 border border-dashed border-[#1A1F42] rounded-xl">
              <h3 className="text-xl text-white mb-2">No articles found</h3>
              <p className="text-gray-400 mb-4">
                Check back soon for more content.
              </p>
            </div>
          )}

          {/* Load more button (implement functionality if needed) */}
          {allPosts.length > 6 && (
            <div className="mt-12 text-center">
              <button className="px-6 py-3 bg-[#1A1F42] hover:bg-[#FF6500]/20 text-white hover:text-[#FF6500] rounded-lg transition-colors">
                Load more articles
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/4 space-y-8">
          <CategoryList categories={categories} />

          {/* Popular tags section */}
          <div className="bg-[#0A0D2C] rounded-lg shadow-sm p-6 border border-[#1A1F42]">
            <h2 className="text-xl font-bold mb-4 text-white">Popular Tags</h2>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(allPosts.flatMap((post) => post.tags)))
                .slice(0, 10)
                .map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-[#1A1F42] text-gray-300 hover:text-[#FF6500] rounded-full text-sm cursor-pointer hover:bg-[#FF6500]/10 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
            </div>
          </div>

          {/* Newsletter section */}
          <div className="bg-[#0A0D2C] rounded-lg shadow-sm p-6 border border-[#FF6500]/20">
            <h2 className="text-xl font-bold mb-4 text-white">Newsletter</h2>
            <p className="text-gray-300 mb-4">
              Get the latest articles and form tips delivered to your inbox.
            </p>
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-4 py-2 bg-[#1A1F42]/70 border border-[#1A1F42] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FF6500]/50 mb-3"
            />
            <button className="w-full py-2 bg-[#FF6500] hover:bg-[#FF7C20] text-white rounded-lg transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
