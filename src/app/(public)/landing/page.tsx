"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FaArrowRight, FaRobot, FaBrain, FaCode, FaChartLine, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';
import { homePageSchemaLd, safeJsonLdStringify } from '@/config/seo';

const LandingPage = () => {
  const [heroImage] = useState('https://images.unsplash.com/photo-1507146426996-ef05306b995a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');

  const features = [
    { icon: <FaRobot className="text-[#3A6B4C]"/>, title: "Hướng dẫn thực tế", desc: "Các bài lab chi tiết về Machine Learning và Deep Learning" },
    { icon: <FaBrain className="text-[#3A6B4C]"/>, title: "Nghiên cứu mới nhất", desc: "Cập nhật những breakthrough trong thế giới AI" },
    { icon: <FaCode className="text-[#3A6B4C]"/>, title: "Mã nguồn mẫu", desc: "Kho code mẫu với TensorFlow/PyTorch" },
    { icon: <FaChartLine className="text-[#3A6B4C]"/>, title: "Case study", desc: "Phân tích ứng dụng AI trong các ngành công nghiệp" }
  ];

  const trendingPosts = [
    { id: 1, title: "Xây dựng GPT từ đầu", category: "NLP", excerpt: "Hướng dẫn chi tiết xây dựng transformer architecture" },
    { id: 2, title: "Fine-tuning Stable Diffusion", category: "Computer Vision", excerpt: "Tối ưu model gen ảnh theo phong cách riêng" },
    { id: 3, title: "Deploy AI Model", category: "MLOps", excerpt: "Triển khai model với Docker và Kubernetes" }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(homePageSchemaLd) }}
      />
      <div className="min-h-screen text-gray-800">
        <section className="container mx-auto px-4 py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Khám phá thế giới 
                <span className="text-[#3A6B4C]"> AI</span> cùng BloAI
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Nền tảng kiến thức AI hàng đầu - Kết nối lý thuyết với thực hành
              </p>
              <div className="flex gap-4">
                <Link href="/auth/signin">
                  <Button className="gap-2 bg-[#3A6B4C] hover:bg-[#2a4d3a] text-white">
                    Bắt đầu ngay
                    <FaArrowRight className="mt-1" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" className="text-[#3A6B4C] border-[#3A6B4C] hover:bg-[#3A6B4C]/10">
                    Tìm hiểu thêm
                  </Button>
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <Image
                src={heroImage}
                alt="AI Visualization"
                width={600}
                height={400}
                className="rounded-xl shadow-xl border-4 border-[#3A6B4C]/20"
                priority
              />
              <Card className="absolute -bottom-4 left-4 p-4 rounded-xl shadow-lg">
                <span className="text-xl font-bold text-[#3A6B4C]">100K+</span>
                <p className="text-sm text-gray-600">Developers tham gia</p>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Lợi ích khi tham gia</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="p-6 rounded-xl hover:shadow-md transition-shadow">
                  <div className="text-4xl mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-center mb-12">Bài viết nổi bật</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendingPosts.map(post => (
              <Card key={post.id} className="rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                <Image
                  src={`https://picsum.photos/400/300?tech=${post.id}`}
                  alt={post.title}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <span className="text-[#3A6B4C] text-sm font-semibold">{post.category}</span>
                  <h3 className="text-xl font-semibold mt-2 mb-3">{post.title}</h3>
                  <p className="text-gray-600">{post.excerpt}</p>
                  <Button variant="link" className="mt-4 text-[#3A6B4C] hover:text-[#2a4d3a] p-0 h-auto">
                    Đọc tiếp <FaArrowRight className="ml-2 text-sm" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-[#3A6B4C] text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Sẵn sàng khám phá AI?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Tham gia cộng đồng 100,000+ developer đang phát triển cùng trí tuệ nhân tạo
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/auth/signin">
                <Button className="bg-white text-[#3A6B4C] hover:bg-gray-100 px-8 py-3">
                  Đăng ký miễn phí
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  Xem demo
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default LandingPage;