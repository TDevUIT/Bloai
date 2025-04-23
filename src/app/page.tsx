import { BlogGrid } from "@/components/blog/BlogGrid";
import { Metadata } from "next";
import Loading from "@/components/loading"; 
import { Suspense } from "react";
import LeaderBoard from "@/components/LeaderBoard";
import EmailSubscribeSection from "@/components/EmailSubscribe";
import TestimonialSection from "@/components/TestimonialSection";

export const metadata: Metadata = {
  title: "Bloai Blog - Hướng Dẫn AI Từ Cơ Bản Đến Nâng Cao | Kiến Thức Công Nghệ Mới Nhất",
  description: "Bloai Blog cung cấp kiến thức AI toàn diện từ cơ bản đến nâng cao. Khám phá hướng dẫn ChatGPT, Machine Learning, Deep Learning và ứng dụng AI trong kinh doanh, y tế, giáo dục. Cập nhật xu hướng AI 2024 và công cụ AI miễn phí.",
  keywords: [
    "AI",
    "Trí tuệ Nhân tạo",
    "Machine Learning",
    "Deep Learning",
    "Generative AI",
    "Neural Networks",
    "Ứng dụng AI",
    "AI cho Doanh nghiệp",
    "AI trong Y tế",
    "AI Giáo dục",
    "AI Marketing",
    "AI trong Fintech",
    "AI trong Logistics",
    "Chuyển đổi số với AI",
    "Smart Assistant",
    "Robotics AI",
    "Tự động hóa với AI",
    "AI và IoT",
    "Hướng dẫn AI",
    "ChatGPT Hướng dẫn",
    "Midjourney Tips",
    "AI Coding",
    "Prompt Engineering",
    "AI Content Creation",
    "Công cụ AI miễn phí",
    "AutoML",
    "Tối ưu hóa AI",
    "Xu hướng AI 2024",
    "Đạo đức AI",
    "AI Ethics",
    "AI Startup",
    "Phát triển AI",
    "Công nghệ AI",
    "AI Việt Nam",
    "Computer Vision",
    "Xử lý ngôn ngữ tự nhiên",
    "AI Automation",
    "Big Data Analytics",
    "AI Framework",
    "AI Model"
  ],
  authors: [{ name: "Bloai Team" }],
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://www.bloai.blog',
    siteName: 'Bloai Blog',
    title: "Bloai Blog - Trung Tâm Kiến Thức AI Hàng Đầu Việt Nam",
    description: "Hướng dẫn toàn diện về Trí tuệ Nhân tạo từ cơ bản đến nâng cao. Cập nhật xu hướng AI mới nhất và ứng dụng thực tiễn trong mọi lĩnh vực đời sống.",
    images: [
      {
        url: 'https://www.bloai.blog/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Bloai Blog - Kiến Thức AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Bloai Blog - Hướng Dẫn AI Từ Cơ Bản Đến Nâng Cao",
    description: "Khám phá thế giới AI với hướng dẫn chi tiết và case study thực tế. Cộng đồng AI lớn nhất Việt Nam",
    images: ['https://www.bloai.blog/images/twitter-card.jpg'],
  },
  alternates: {
    canonical: 'https://www.bloai.blog',
    types: {
      'application/rss+xml': 'https://www.bloai.blog/rss.xml',
    },
  },
  
};

export default async function Home() {
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Blog AI - Tin tức Công nghệ",
    "url": "https://www.bloai.blog/",
    "description": "Tổng hợp các bài viết mới nhất về trí tuệ nhân tạo và công nghệ",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.bloai.blog/"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Bloai Blog",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.bloai.blog/images/Logo/favicon-32x32.png"
      }
    },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "item": {
            "@type": "BlogPosting",
            "url": "https://www.bloai.blog/blog/bat-trend-mang-xa-hoi-cach-tao-vi-djo-choi-gioi-thieu-ban-than-voi-gpt",
            "name": "Bắt Trend Mạng Xã Hội: Cách tạo Vỉ Đồ Chơi Giới Thiệu Bản Thân Với GPT"
          }
        },
        {
          "@type": "ListItem",
          "position": 2,
          "item": {
            "@type": "BlogPosting",
            "url": "https://www.bloai.blog/blog/tim-hieu-sau-ve-amazon-kendra-genai-index-2025-huong-dan-chi-tiet",
            "name": "Tìm hiểu sâu về Amazon Kendra GenAI Index (2025) [Hướng dẫn Chi Tiết]"
          }
        },
        {
          "@type": "ListItem",
          "position": 3,
          "item": {
            "@type": "BlogPosting",
            "url": "https://www.bloai.blog/blog/xay-dung-ai-assistant-bi-mat-tao-tro-ly-thong-minh-tu-notion-huong-dan-day-du-2025",
            "name": "Xây dựng AI Assistant: Bí mật Tạo Trợ Lý Thông Minh Từ Notion (Hướng dẫn Đầy đủ 2025)"
          }
        }
      ]
    }
  };
  
  return (
    <>
      <script
         type="application/ld+json"
         dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema).replace(/</g, '\\u003c') }}
       />
        <main className="flex flex-col">
        <section className="px-4 min-[375px]:px-6 md:px-8 lg:px-10 xl:px-12 py-6 min-[375px]:py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800 dark:text-gray-200 text-center underline decoration-[#3A6B4C] decoration-4 underline-offset-4">
            BÀI VIẾT NỔI BẬT
          </h1>
          
          <Suspense fallback={<Loading />}>
            <BlogGrid />
          </Suspense>
        </section>

        <section className="w-full">
          <LeaderBoard />
        </section>

        <section className="w-full bg-gray-50 dark:bg-gray-800 py-12">
          <EmailSubscribeSection 
            title="Khám Phá Thế Giới AI Cùng Bloai"
            description="Trở thành một phần của cộng đồng đam mê AI tại Bloai! Đăng ký nhận bản tin hàng tuần để cập nhật những thông tin giá trị về trí tuệ nhân tạo."
          />
        </section>


        <section>
          <TestimonialSection />
        </section>
      </main>
    </>
  );
}