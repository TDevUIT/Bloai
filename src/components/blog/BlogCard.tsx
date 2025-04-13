import React from 'react';
import Link from 'next/link';
import { CldImage } from 'next-cloudinary';
import { FaArrowRight } from 'react-icons/fa';
import { Prisma } from '@prisma/client';

type Blog = Prisma.BlogGetPayload<{
  include: {
    tags: true;
    author: true;
  };
}>;

interface BlogCardProps {
  blog: Blog;
}

export function BlogCard({ blog }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="group block "
      passHref
      legacyBehavior={false}
    >
      <div className="overflow-hidden h-full flex flex-col border-none shadow-none bg-transparent">
        <div className="relative h-48 sm:h-56 w-full overflow-hidden">
          <CldImage
            width={600}
            height={400}
            src={blog.imageUrl || 'default'}
            alt={blog.title || 'Blog cover'}
            className="w-full h-full object-cover"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
            crop="fill"
            gravity="auto"
            quality="auto:best"
            format="auto"
          />
        </div>

        <div className="p-5 flex-grow">
          <h3 className="text-lg font-semibold text-[#2B463C] mb-2 group-hover:text-[#3A6B4C] transition-colors line-clamp-2">
            {blog.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
            {blog.metaDescription}
          </p>
        </div>

        <div className="p-5 pt-0">
          <div className="flex items-center text-[#3A6B4C] font-medium text-sm">
            <span className="mr-1">Read More</span>
            <FaArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}