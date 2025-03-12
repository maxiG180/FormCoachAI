// src/components/blog/categoryList.tsx
"use client";

import Link from "next/link";
import { CategoryData } from "@/lib/blog";

interface CategoryListProps {
  categories: CategoryData[];
}

export default function CategoryList({ categories }: CategoryListProps) {
  // Handle undefined or empty categories
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#0A0D2C] rounded-lg shadow-sm p-6 border border-[#1A1F42]">
      <h2 className="text-xl font-bold mb-4 text-white">Categories</h2>

      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.slug}>
            <Link
              href={`/blog/${category.slug}`}
              className="text-gray-300 hover:text-[#FF6500] transition-colors duration-200 flex items-center group"
            >
              <span className="w-2 h-2 bg-gray-600 rounded-full group-hover:bg-[#FF6500] transition-colors duration-200 mr-2"></span>
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
