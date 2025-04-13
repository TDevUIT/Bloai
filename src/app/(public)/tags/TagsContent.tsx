'use client';

import React from 'react';
import Link from 'next/link';
import { api } from '@/trpc/react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tag, FolderOpen, BookOpenText, AlertTriangle, ArrowRight } from 'lucide-react';
import { slugify } from '@/types/helper.type';

const TagsContent = () => {
  const { data, isLoading, error } = api.blog.getAllTags.useQuery({
    page: 1,
    limit: 100, 
  });

  const generateSchemaItemList = () => {
    if (!data || !data.tags || data.tags.length === 0) {
      return [
        { "@type": "ListItem", "position": 1, "name": "AI Tổng Quát", url: "https://bloai.blog/tags/ai-tong-quat" },
        { "@type": "ListItem", "position": 2, "name": "Xử Lý Ngôn Ngữ Tự Nhiên", url: "https://bloai.blog/tags/xu-ly-ngon-ngu-tu-nhien" },
      ];
    }
    return data.tags.slice(0, 10).map((tag, index) => ({ 
      "@type": "ListItem",
      "position": index + 1,
      "name": tag.name,
      "url": `https://bloai.blog/tags/${slugify(tag.name)}`
    }));
  };

  const tagsSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Chuyên mục và Chủ đề AI | Bloai Blog",
    "description": "Khám phá danh sách các chuyên mục và chủ đề nổi bật về Trí Tuệ Nhân Tạo (AI) trên Bloai Blog. Tìm đọc các bài viết theo lĩnh vực bạn quan tâm.",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": generateSchemaItemList()
    }
  };


  if (isLoading) return <CategoriesLoadingSkeleton />;

  if (error) return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center bg-red-50 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md rounded-xl border border-red-200 bg-white p-6 text-center shadow-lg sm:p-8">
        <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-red-500 sm:h-14 sm:w-14" />
        <h2 className="mb-2 text-xl font-semibold text-red-800 sm:text-2xl">
          Lỗi Tải Dữ Liệu
        </h2>
        <p className="mb-5 text-gray-700">
          Không thể tải danh sách chuyên mục lúc này. Vui lòng kiểm tra kết nối mạng và thử làm mới trang.
        </p>
        <pre className="whitespace-pre-wrap rounded bg-red-100 p-3 text-left text-sm text-red-700 break-all">
          {error.message}
        </pre>
      </div>
    </div>
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tagsSchema).replace(/</g, '\\u003c') }}
      />

      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-9xl">
          <header className="mb-10 border-b border-gray-200 pb-8 text-center md:mb-14">
            <h1 className="mb-3 flex items-center justify-center gap-3 text-3xl font-bold text-[#333] font-serif sm:mb-4 sm:text-4xl lg:text-5xl">
              <FolderOpen className="h-8 w-8 shrink-0 text-[#3A6B4C] sm:h-10 sm:w-10" />
              Khám phá Chuyên mục
            </h1>
            <p className="mx-auto max-w-2xl text-base text-gray-600 sm:text-lg">
              Duyệt qua các chủ đề AI được phân loại. Nhấp vào một chuyên mục để xem tất cả bài viết liên quan.
            </p>
          </header>

          {data && data.tags.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6"> 
              {data.tags.map((tag) => {
                const tagSlug = slugify(tag.name); 
                const tagUrl = `/tags/${tagSlug}`; 

                return (
                  <Link
                    href={'/tags'}
                    key={tag.id}
                    className="group flex h-full transform md:flex-col rounded-lg border border-gray-200/90 bg-white shadow-xs transition-all duration-300 ease-in-out hover:-translate-y-1.5 hover:shadow-lg hover:border-[#3A6B4C]/50 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#3A6B4C] focus-visible:ring-offset-2"
                  >
                    <div className="flex h-full flex-col p-5">
                      <div className="mb-3 flex md:flex-row sm:flex-col items-start justify-between gap-3">
                        <h2 className="flex items-center gap-2.5 pr-2 text-lg font-semibold text-gray-800 transition-colors group-hover:text-[#3A6B4C] sm:text-xl">
                          <Tag className="h-5 w-5 shrink-0 text-gray-400 transition-colors group-hover:text-[#3A6B4C]" />
                          <span className="break-words">{tag.name}</span>
                        </h2>
                        <span className="shrink-0 whitespace-nowrap rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 ring-1 ring-inset ring-green-600/20 sm:text-sm">
                          {tag._count?.blogs ?? 0} bài
                        </span>
                      </div>

                      {tag.description ? (
                        <p className="mb-4 grow text-sm leading-relaxed text-gray-600 line-clamp-3">
                          {tag.description}
                        </p>
                      ) : (
                        <div className="mb-4 h-[3.75rem] grow"></div> 
                      )}

                      {/* <div className="mt-auto pt-2">
                        <div className="inline-flex items-center text-sm font-medium text-[#3A6B4C] transition-colors group-hover:text-[#2a553b]">
                          Xem bài viết
                          <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-200 ease-in-out group-hover:translate-x-1" aria-hidden="true" />
                        </div>
                      </div> */}
                    </div>
                  </Link> 
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed border-gray-300 bg-gray-100/60 px-6 py-16 text-center sm:py-24">
              <BookOpenText className="mx-auto mb-4 h-14 w-14 text-gray-400 sm:h-16 sm:w-16" />
              <h3 className="text-xl font-semibold text-gray-800 sm:text-2xl">
                Chưa có chuyên mục nào
              </h3>
              <p className="max-w-md text-gray-600">
                Hiện tại chưa có chuyên mục nào được tạo. Chúng tôi sẽ cập nhật ngay khi có nội dung mới được phân loại!
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};


const CategoriesLoadingSkeleton = () => (
  <div className="min-h-screen animate-pulse bg-gray-50/50 p-4 sm:p-6 lg:p-8">
    <div className="mx-auto max-w-7xl">
      <div className="mb-10 border-b border-gray-200 pb-8 text-center md:mb-14">
        <Skeleton className="mx-auto mb-4 h-9 w-3/5 max-w-md rounded-lg bg-gray-300 sm:h-10 lg:h-12" />
        <Skeleton className="mx-auto h-5 w-4/5 max-w-xl rounded-lg bg-gray-200 sm:h-6" />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
        {[...Array(8)].map((_, i) => ( 
          <div key={i} className="flex h-full flex-col rounded-lg border border-gray-200/90 bg-white p-5 shadow-xs">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5 pr-2 flex-1">
                 <Skeleton className="h-5 w-5 shrink-0 rounded bg-gray-300"/>
                 <Skeleton className="h-6 w-3/5 rounded bg-gray-300 sm:h-7" />
              </div>
              <Skeleton className="h-6 w-[70px] shrink-0 rounded-full bg-gray-200 sm:h-7 sm:w-[80px]" />
            </div>
            <div className="mb-4 grow space-y-2">
                 <Skeleton className="h-4 w-full rounded bg-gray-200" />
                 <Skeleton className="h-4 w-full rounded bg-gray-200" />
                 <Skeleton className="h-4 w-4/5 rounded bg-gray-200" />
            </div>
            <div className="mt-auto pt-2">
              <Skeleton className="h-5 w-28 rounded bg-gray-300" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default TagsContent;