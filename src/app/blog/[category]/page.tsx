// src/app/blog/[category]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ChevronRight } from "lucide-react";
import BlogCard from "@/components/blog/blogCard";
import { getPostsByCategory, getCategoryData, getCategories } from "@/lib/blog";

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const categoryData = await getCategoryData(params.category);

  if (!categoryData) {
    return {
      title: "Category Not Found | FormCoachAI Blog",
    };
  }

  return {
    title: `${categoryData.name} | FormCoachAI Blog`,
    description: categoryData.description,
    openGraph: {
      title: `${categoryData.name} Articles | FormCoachAI Blog`,
      description: categoryData.description,
    },
  };
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({
    category: category.slug,
  }));
}

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  // Using Promise.all to execute requests in parallel
  const category = params.category;
  const [posts, categoryData, allCategories] = await Promise.all([
    getPostsByCategory(category),
    getCategoryData(category),
    getCategories(),
  ]);

  if (!categoryData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0D2C] to-[#070919]">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-400 mb-8 flex items-center">
          <Link href="/blog" className="hover:text-[#FF6500] transition-colors">
            Blog
          </Link>
          <ChevronRight className="mx-2 h-4 w-4" />
          <span className="text-[#FF6500] font-medium">
            {categoryData.name}
          </span>
        </div>

        {/* Category header */}
        <div className="mb-12 pb-8 border-b border-[#1A1F42]">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-1 bg-[#FF6500] rounded-full"></div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              {categoryData.name}
            </h1>
          </div>
          <p className="text-lg text-gray-300 max-w-3xl mt-4 leading-relaxed">
            {categoryData.description}
          </p>
        </div>

        {/* Category navigation */}
        <div className="mb-12 flex flex-wrap gap-3">
          <Link
            href="/blog"
            className="px-5 py-2.5 rounded-full text-sm font-medium bg-[#1A1F42] text-gray-300 hover:bg-[#FF6500]/20 hover:text-[#FF6500] transition-colors"
          >
            All Articles
          </Link>
          {allCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/blog/${cat.slug}`}
              className={`px-5 py-2.5 rounded-full text-sm font-medium ${
                cat.slug === category
                  ? "bg-[#FF6500]/20 text-[#FF6500] border border-[#FF6500]/30"
                  : "bg-[#1A1F42] text-gray-300 hover:bg-[#FF6500]/20 hover:text-[#FF6500]"
              } transition-colors`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Featured post (first post in category) */}
        {posts.length > 0 && (
          <div className="mb-16">
            <div className="relative overflow-hidden rounded-2xl shadow-xl bg-[#1A1F42]/50 border border-[#1A1F42] hover:border-[#FF6500]/30 transition-all group">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative h-[300px] w-full overflow-hidden">
                  <Image
                    src={posts[0].featuredImage}
                    alt={posts[0].title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D2C]/80 to-transparent md:bg-gradient-to-r md:from-[#0A0D2C]/80 md:to-transparent"></div>
                </div>

                <div className="relative p-6 md:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#FF6500]/20 text-[#FF6500]">
                      {categoryData.name}
                    </span>
                    <div className="flex items-center text-gray-400 text-sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      <time dateTime={posts[0].date}>
                        {new Date(posts[0].date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                    {posts[0].title}
                  </h2>

                  <p className="text-gray-300 mb-6 line-clamp-3">
                    {posts[0].excerpt}
                  </p>

                  <Link
                    href={`/blog/${category}/${posts[0].slug}`}
                    className="inline-flex items-center text-[#FF6500] font-medium hover:underline"
                  >
                    Read Article
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.slice(1).map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>

        {/* Empty state */}
        {posts.length === 0 && (
          <div className="text-center py-20 px-6 border border-dashed border-[#1A1F42] rounded-xl bg-[#1A1F42]/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto mb-4 text-gray-500 opacity-50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
            <h3 className="text-xl text-white font-semibold mb-2">
              No articles found
            </h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              We haven't published any articles in this category yet, but stay
              tuned for new content coming soon.
            </p>
            <Link
              href="/blog"
              className="px-6 py-2.5 bg-[#1A1F42] hover:bg-[#FF6500]/20 text-[#FF6500] rounded-full font-medium transition-colors"
            >
              Browse all articles
            </Link>
          </div>
        )}

        {/* Pagination (simplified, can be expanded) */}
        {posts.length > 9 && (
          <div className="mt-16 flex justify-center items-center gap-2">
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1A1F42] text-white hover:bg-[#FF6500]/20 hover:text-[#FF6500]"
            >
              &laquo;
            </a>
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FF6500]/20 text-[#FF6500]"
            >
              1
            </a>
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1A1F42] text-white hover:bg-[#FF6500]/20 hover:text-[#FF6500]"
            >
              2
            </a>
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1A1F42] text-white hover:bg-[#FF6500]/20 hover:text-[#FF6500]"
            >
              &raquo;
            </a>
          </div>
        )}

        {/* Subscribe section */}
        <div className="mt-20 mb-8 p-8 md:p-12 bg-[#1A1F42]/50 rounded-2xl border border-[#1A1F42]">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Stay updated with the latest content
            </h3>
            <p className="text-gray-300 mb-8">
              Subscribe to our newsletter to receive updates on new articles,
              product features, and fitness tips.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="px-5 py-3 rounded-full bg-[#0A0D2C] border border-[#1A1F42] text-white focus:border-[#FF6500]/50 focus:outline-none flex-grow"
              />
              <button className="px-6 py-3 bg-[#FF6500] hover:bg-[#FF6500]/90 text-white rounded-full font-medium transition-colors sm:w-auto w-full">
                Subscribe
              </button>
            </div>
            <p className="text-gray-400 text-sm mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
