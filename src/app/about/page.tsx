"use client"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Bot, Brain, Code, TrendingUp, Rocket, Users, BookOpen, Mail, Linkedin, Github } from "lucide-react"

const LandingPage = () => {
  const [heroImage] = useState(
    "https://images.unsplash.com/photo-1507146426996-ef05306b995a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  )

  const teamMembers = [
    {
      name: "Nhóm BloAI",
      role: "Nhà phát triển & Content Creator",
      bio: "Nhóm sinh viên nhiệt huyết với AI",
      avatar: "/images/Logo/web-app-manifest-512x512.png",
    },
  ]

  const features = [
    {
      icon: <Bot className="text-blue-600 h-6 w-6" />,
      title: "Kiến thức AI từ cơ bản đến nâng cao",
      desc: "Các bài viết dễ hiểu về học AI cho người mới bắt đầu, giúp bạn tiếp cận công nghệ này mà không cần kiến thức chuyên sâu.",
    },
    {
      icon: <Brain className="text-blue-600 h-6 w-6" />,
      title: "Hướng dẫn ứng dụng AI vào thực tế",
      desc: "Học cách sử dụng AI trong cuộc sống, từ công nghệ chatbot, tạo nội dung bằng AI, đến lập trình AI cơ bản.",
    },
    {
      icon: <Code className="text-blue-600 h-6 w-6" />,
      title: "Cập nhật xu hướng AI mới nhất",
      desc: "Blog cung cấp thông tin mới về công nghệ AI, giúp bạn không bỏ lỡ bất kỳ đổi mới nào trong lĩnh vực này.",
    },
    {
      icon: <TrendingUp className="text-blue-600 h-6 w-6" />,
      title: "Tài nguyên và công cụ AI hữu ích",
      desc: "Chúng tôi giới thiệu các nền tảng AI miễn phí, khóa học AI online, cùng với mẹo tối ưu hóa AI cho công việc và học tập.",
    },
  ]

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Bloai – Khám phá Trí tuệ Nhân tạo dễ dàng hơn bao giờ hết!
              <span className="text-blue-600"> AI cho mọi người</span> – Học, Ứng dụng và Phát triển
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Chào mừng bạn đến với BloAI! Đây là nơi giúp bạn tìm hiểu về trí tuệ nhân tạo (AI) theo cách đơn giản, dễ
              hiểu và thực tế nhất. Nơi dành cho người mới bắt đầu với AI, muốn khám phá cách AI hoạt động, hay đang tìm
              kiếm tài nguyên học tập AI chất lượng.
            </p>
            <div className="flex gap-4">
              <Link
                href="/auth/signin"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white font-medium transition-colors"
              >
                Bắt đầu ngay
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                Tìm hiểu thêm
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <Image
              src={heroImage || "/placeholder.svg"}
              alt="AI Visualization"
              width={600}
              height={400}
              className="rounded-xl shadow-xl border-4 border-blue-100"
              priority
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Chúng tôi mang đến điều gì</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section id="why-us" className="w-full py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            💡 Tại sao bạn nên theo dõi blog này?
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-sm text-center border border-gray-100">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-blue-600 text-2xl">✅</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Dành cho mọi cấp độ</h3>
              <p className="text-gray-600">
                Dù bạn là người mới hay đã có nền tảng, blog đều có nội dung phù hợp với bạn.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm text-center border border-gray-100">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-blue-600 text-2xl">✅</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Nội dung dễ đọc, dễ hiểu</h3>
              <p className="text-gray-600">Chúng tôi giúp bạn học AI mà không cảm thấy quá tải.</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm text-center border border-gray-100">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-blue-600 text-2xl">✅</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Cộng đồng hỗ trợ</h3>
              <p className="text-gray-600">
                Bạn có thể đặt câu hỏi, thảo luận và học hỏi cùng những người đam mê AI khác.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Team Section */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" />
            <h2 className="text-2xl font-bold text-gray-900 bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Đội ngũ phát triển
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Nhóm BloAI</h3>
              <p className="text-gray-600 leading-relaxed">
                Dự án được phát triển bởi nhóm sinh viên Đại học Công Nghệ Thông Tin - UIT trong khuôn khổ môn học
                <span className="text-blue-600 font-medium"> IE204 - SEO</span>. Chúng tôi áp dụng:
              </p>
              <ul className="grid grid-cols-2 gap-3">
                {["SEO On-page/Off-page", "Content Marketing", "Technical SEO", "Phân tích dữ liệu"].map(
                  (item, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="w-6 h-6 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                        {index % 2 === 0 ? <Code className="h-3 w-3" /> : <BookOpen className="h-3 w-3" />}
                      </div>
                      <span className="font-medium text-sm">{item}</span>
                    </li>
                  ),
                )}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-md hover:translate-y-[-3px] transition-transform">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <Image
                    src={teamMembers[0].avatar || "/placeholder.svg"}
                    alt={teamMembers[0].name}
                    width={80}
                    height={80}
                    className="rounded-xl object-contain"
                  />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-bold text-gray-900">{teamMembers[0].name}</h4>
                  <p className="text-gray-600 text-sm">{teamMembers[0].role}</p>
                  <div className="flex gap-3">
                    {[
                      { icon: <Linkedin className="h-4 w-4" />, color: "text-[#0A66C2]" },
                      { icon: <Github className="h-4 w-4" />, color: "text-gray-700" },
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
            </div>
          </div>
        </div>
      </section>
      {/* Contact Section */}
      <section className="container mx-auto px-4 py-12 mb-8 max-w-5xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" />
          <h2 className="text-2xl font-bold text-gray-900 bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
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
                <li
                  key={index}
                  className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  <div
                    className={`w-6 h-6 ${index % 2 === 0 ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"} rounded-lg flex items-center justify-center`}
                  >
                    {index % 2 === 0 ? <Code className="h-3 w-3" /> : <Users className="h-3 w-3" />}
                  </div>
                  <span className="font-medium text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl space-y-4 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
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
                  { icon: <Linkedin className="h-4 w-4" />, color: "bg-[#0A66C2]/10", text: "text-[#0A66C2]" },
                  { icon: <Github className="h-4 w-4" />, color: "bg-gray-700/10", text: "text-gray-700" },
                ].map((item, index) => (
                  <a
                    key={index}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.color} ${item.text} hover:opacity-80 transition-all hover:-translate-y-1`}
                    href="https://github.com/TDevUIT/Bloai"
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section id="get-started" className="w-full py-16 md:py-24 bg-blue-50 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">📢 Bắt đầu ngay!</h2>

          <p className="text-gray-700 text-xl mb-8">
            📌 Khám phá ngay blog của chúng tôi và bắt đầu hành trình với trí tuệ nhân tạo! Đừng quên theo dõi để nhận
            cập nhật mới nhất về AI và đón đọc những bài viết hữu ích nhất.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="bg-blue-600 text-white px-8 py-4 rounded-md font-medium min-w-[200px] text-center text-lg hover:bg-blue-700 transition-colors"
            >
              Khám Phá Blog
            </Link>
            <Link
              href="/subscribe"
              className="bg-white text-blue-600 px-8 py-4 rounded-md font-medium min-w-[200px] text-center text-lg hover:bg-gray-50 transition-colors border border-blue-200"
            >
              Đăng Ký Nhận Tin
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage

