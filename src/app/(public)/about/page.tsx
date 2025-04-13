"use client"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Bot, Brain, Code, TrendingUp, Users, BookOpen, Mail } from "lucide-react"
import { FaGithub, FaLinkedin } from "react-icons/fa"
import { aboutPageSchemaLd, safeJsonLdStringify } from "@/config/seo"

interface TeamMember {
  name: string
  role: string
  bio: string
  avatar: string
}

interface Feature {
  icon: JSX.Element
  title: string
  desc: string
}

const AboutPage = () => {
  const [heroImage] = useState(
    "https://images.unsplash.com/photo-1507146426996-ef05306b995a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  )

  const teamMembers: TeamMember[] = [
    {
      name: "Nhóm BloAI",
      role: "Nhà phát triển & Content Creator",
      bio: "Nhóm sinh viên nhiệt huyết với AI",
      avatar: "/images/Logo/web-app-manifest-512x512.png",
    },
  ];

  const features: Feature[] = [
    {
      icon: <Bot className="text-[#3A6B4C] h-6 w-6" />,
      title: "Kiến thức AI từ cơ bản đến nâng cao",
      desc: "Các bài viết dễ hiểu về học AI cho người mới bắt đầu, giúp bạn tiếp cận công nghệ này mà không cần kiến thức chuyên sâu.",
    },
    {
      icon: <Brain className="text-[#3A6B4C] h-6 w-6" />,
      title: "Hướng dẫn ứng dụng AI vào thực tế",
      desc: "Học cách sử dụng AI trong cuộc sống, từ công nghệ chatbot, tạo nội dung bằng AI, đến lập trình AI cơ bản.",
    },
    {
      icon: <Code className="text-[#3A6B4C] h-6 w-6" />,
      title: "Cập nhật xu hướng AI mới nhất",
      desc: "Blog cung cấp thông tin mới về công nghệ AI, giúp bạn không bỏ lỡ bất kỳ đổi mới nào trong lĩnh vực này.",
    },
    {
      icon: <TrendingUp className="text-[#3A6B4C] h-6 w-6" />,
      title: "Tài nguyên và công cụ AI hữu ích",
      desc: "Chúng tôi giới thiệu các nền tảng AI miễn phí, khóa học AI online, cùng với mẹo tối ưu hóa AI cho công việc và học tập.",
    },
  ]

  return (
    <div className="min-h-screen text-gray-800">
      <section className="py-20">
        <div className="container mx-auto px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Chúng tôi mang đến điều gì</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 rounded-xl hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="why-us" className="w-full py-16 md:py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            💡 Tại sao bạn nên theo dõi blog này?
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-8 rounded-lg text-center">
              <div className="w-16 h-16 bg-[#3A6B4C]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-[#3A6B4C] text-2xl">✅</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Dành cho mọi cấp độ</h3>
              <p className="text-gray-600">
                Dù bạn là người mới hay đã có nền tảng, blog đều có nội dung phù hợp với bạn.
              </p>
            </Card>

            <Card className="p-8 rounded-lg text-center">
              <div className="w-16 h-16 bg-[#3A6B4C]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-[#3A6B4C] text-2xl">✅</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Nội dung dễ đọc, dễ hiểu</h3>
              <p className="text-gray-600">Chúng tôi giúp bạn học AI mà không cảm thấy quá tải.</p>
            </Card>

            <Card className="p-8 rounded-lg text-center">
              <div className="w-16 h-16 bg-[#3A6B4C]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-[#3A6B4C] text-2xl">✅</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Cộng đồng hỗ trợ</h3>
              <p className="text-gray-600">
                Bạn có thể đặt câu hỏi, thảo luận và học hỏi cùng những người đam mê AI khác.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-1 w-12 bg-[#3A6B4C] rounded-full" />
            <h2 className="text-2xl font-bold text-gray-900">
              Đội ngũ phát triển
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Nhóm BloAI</h3>
              <p className="text-gray-600 leading-relaxed">
                Dự án được phát triển bởi nhóm sinh viên Đại học Công Nghệ Thông Tin - UIT trong khuôn khổ môn học
                <span className="text-[#3A6B4C] font-medium"> IE204 - SEO</span>. Chúng tôi áp dụng:
              </p>
              <ul className="grid grid-cols-2 gap-3">
                {["SEO On-page/Off-page", "Content Marketing", "Technical SEO", "Phân tích dữ liệu"].map(
                  (item, index) => (
                    <li key={index}>
                      <Card className="flex items-center gap-2 p-3 rounded-lg hover:shadow-md transition-shadow">
                        <div className="w-6 h-6 bg-[#3A6B4C]/10 rounded-lg flex items-center justify-center text-[#3A6B4C]">
                          {index % 2 === 0 ? <Code className="h-3 w-3" /> : <BookOpen className="h-3 w-3" />}
                        </div>
                        <span className="font-medium text-sm">{item}</span>
                      </Card>
                    </li>
                  ),
                )}
              </ul>
            </div>

            <Card className="bg-[#3A6B4C]/10 rounded-xl p-6 hover:translate-y-[-3px] transition-transform">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 shrink-0">
                  <Image
                    src={teamMembers[0]?.avatar || "/placeholder.svg"}
                    alt={teamMembers[0]?.name || ''}
                    width={80}
                    height={80}
                    className="rounded-xl object-contain"
                  />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-bold text-gray-900">{teamMembers[0]?.name}</h4>
                  <p className="text-gray-600 text-sm">{teamMembers[0]?.role}</p>
                  <div className="flex gap-3">
                    {[
                      { icon: <FaLinkedin className="h-4 w-4" />, color: "text-[#3A6B4C]" },
                      { icon: <FaGithub className="h-4 w-4" />, color: "text-[#3A6B4C]" },
                    ].map((item, index) => (
                      <a
                        key={index}
                        className={`${item.color} hover:text-opacity-80 transition-all hover:scale-110`}
                        href="https://github.com/TDevUIT/Bloai"
                      >
                        {item.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 mb-8 max-w-5xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-1 w-12 bg-[#3A6B4C] rounded-full" />
          <h2 className="text-2xl font-bold text-gray-900">
            Liên hệ hợp tác
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="text-gray-600 leading-relaxed">
              Chúng tôi luôn mở rộng hợp tác với các chuyên gia AI/ML, nhà nghiên cứu, công ty công nghệ và content
              creator.
            </p>
            <ul className="grid grid-cols-2 gap-3">
              {["Chuyên gia AI/ML", "Nhà nghiên cứu", "Công ty công nghệ", "Content Creator"].map((item, index) => (
                <li key={index}>
                  <Card className="flex items-center gap-2 p-3 rounded-lg hover:shadow-md transition-all">
                    <div className={`w-6 h-6 bg-[#3A6B4C]/10 text-[#3A6B4C] rounded-lg flex items-center justify-center`}>
                      {index % 2 === 0 ? <Code className="h-3 w-3" /> : <Users className="h-3 w-3" />}
                    </div>
                    <span className="font-medium text-sm">{item}</span>
                  </Card>
                </li>
              ))}
            </ul>
          </div>

          <Card className="bg-[#3A6B4C]/10 p-6 rounded-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#3A6B4C]/10 rounded-lg flex items-center justify-center text-[#3A6B4C]">
                <Mail className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium text-gray-600 text-sm">Liên hệ qua email</p>
                <p className="text-lg font-semibold text-gray-900">ie204seo@gmail.com</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="font-medium text-gray-600 text-sm">Theo dõi chúng tôi</p>
              <div className="flex gap-4">
                {[
                  { icon: <FaLinkedin className="h-4 w-4" />, color: "bg-[#3A6B4C]/10" },
                  { icon: <FaGithub className="h-4 w-4" />, color: "bg-[#3A6B4C]/10" },
                ].map((item, index) => (
                  <a
                    key={index}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.color} text-[#3A6B4C] hover:opacity-80 transition-all hover:-translate-y-1`}
                    href="https://github.com/TDevUIT/Bloai"
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section id="get-started" className="w-full py-16 md:py-24 bg-[#3A6B4C]/10 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">📢 Bắt đầu ngay!</h2>
          <p className="text-gray-700 text-xl mb-8">
            📌 Khám phá ngay blog của chúng tôi và bắt đầu hành trình với trí tuệ nhân tạo!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/">
              <Button className="bg-[#3A6B4C] hover:bg-[#2a4d3a] text-white px-8 py-4 text-lg">
                Khám Phá Blog
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(aboutPageSchemaLd)}}
      />
    </div>
  )
}

export default AboutPage