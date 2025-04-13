'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { FaHome, FaArrowLeft, FaSearch, FaExclamationTriangle } from 'react-icons/fa';


const NotFound = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-800 px-4 py-16">
        <div className="text-center max-w-lg w-full">
          {/* Icon lỗi */}
          <FaExclamationTriangle className="mx-auto text-yellow-500 text-6xl mb-6" />

          {/* Mã lỗi */}
          <h1 className="text-6xl md:text-8xl font-bold text-gray-400 mb-4">
            404
          </h1>

          {/* Tiêu đề chính */}
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-3">
            Oops! Có vẻ như trang này đã "bay màu".
          </h2>

          {/* Mô tả lỗi và gợi ý */}
          <p className="text-base md:text-lg text-gray-600 mb-8">
            Trang bạn đang tìm kiếm không tồn tại, có thể đã bị xóa, đổi tên hoặc tạm thời không khả dụng. Đừng lo lắng, hãy thử các cách sau:
          </p>

          {/* Form Tìm kiếm */}
          <div className="mb-8">
            <p className="text-gray-600 mb-3 font-medium">Tìm kiếm nội dung khác trên Bloai:</p>
            <form
              className="flex mx-auto max-w-sm"
              onSubmit={handleSearchSubmit}
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nhập từ khóa bài viết..."
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-l-md focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                aria-label="Tìm kiếm bài viết"
              />
              <button
                type="submit"
                className="bg-blue-600 px-5 py-2.5 rounded-r-md flex items-center justify-center text-white hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition duration-200 ease-in-out disabled:opacity-50"
                disabled={!searchQuery.trim()}
                aria-label="Thực hiện tìm kiếm"
              >
                <FaSearch />
              </button>
            </form>
          </div>

          {/* Nút Hành động */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {/* Nút Trang chủ */}
            <Link
              href="/"
              className="px-6 py-2.5 flex items-center justify-center gap-2 bg-blue-600 rounded-md font-medium text-white hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition duration-200 ease-in-out"
            >
              <FaHome /> Về Trang Chủ Bloai
            </Link>

            {/* Nút Quay lại */}
            <button
              onClick={() => window.history.back()}
              className="px-6 py-2.5 flex items-center justify-center gap-2 bg-gray-200 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-300 focus:outline-hidden focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 transition duration-200 ease-in-out"
            >
              <FaArrowLeft /> Quay lại trang trước
            </button>
          </div>

          {/* Footer nhỏ */}
          <div className="mt-16 text-gray-500 text-sm">
            Nếu bạn nghĩ đây là lỗi, vui lòng <Link href="/contact" className="text-blue-600 hover:underline">liên hệ</Link> với chúng tôi.
            <br />
            © {new Date().getFullYear()} Bloai Blog.
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;