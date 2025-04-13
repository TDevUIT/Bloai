import { Metadata } from 'next'
import React from 'react'
import TagsContent from './TagsContent'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Chủ đề AI phổ biến | Bloai Blog",
    description: "Khám phá các chủ đề AI hot nhất với hơn 100 tags về Machine Learning, Deep Learning, ChatGPT và ứng dụng thực tế",
    keywords: ["tags AI", "chủ đề AI", "thẻ AI", "machine learning tags"],
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
  }
}
const TagPage = () => {
  return (
    <TagsContent />
  )
}

export default TagPage