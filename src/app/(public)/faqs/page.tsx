"use client"
import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { FaQuestionCircle, FaArrowRight, FaEnvelope, FaChevronDown } from "react-icons/fa"

interface AccordionItemProps {
  question: string
  answer: string
}
const AccordionItem = ({ question, answer }: AccordionItemProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 text-left font-semibold text-gray-900"
      >
        <span>{question}</span>
        <FaChevronDown className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && <div className="px-6 py-4 text-gray-600 bg-gray-50 border-t border-gray-100">{answer}</div>}
    </div>
  )
}

export default function FAQsPage() {
  const faqs = [
    {
      question: "Blog này dành cho ai?",
      answer:
        "Blog này dành cho tất cả mọi người – từ người mới bắt đầu học AI, lập trình viên, đến những ai muốn hiểu cách AI hoạt động và ứng dụng AI vào cuộc sống.",
    },
    {
      question: "Tôi có cần biết lập trình để học AI không?",
      answer:
        "Không bắt buộc! Bạn có thể bắt đầu từ các công cụ AI không cần code, sau đó học dần các khái niệm nâng cao.",
    },
    {
      question: "Blog có tài nguyên học AI miễn phí không?",
      answer: "Có! Chúng tôi cung cấp các bài viết, hướng dẫn và tài liệu miễn phí để bạn học AI dễ dàng nhất.",
    },
    {
      question: "Làm sao để cập nhật tin tức mới nhất về AI?",
      answer: "Bạn có thể đăng ký nhận tin qua email hoặc theo dõi blog để không bỏ lỡ bất kỳ thông tin nào.",
    },
  ]

  interface ResourceItem {
    title: string
    description: string
    link: string
  }

  const resources: ResourceItem[] = [
    {
      title: "Bài viết cho người mới",
      description: "Các bài viết cơ bản giúp bạn bắt đầu với AI một cách dễ dàng.",
      link: "/",
    },
    {
      title: "Hướng dẫn thực hành",
      description: "Các hướng dẫn từng bước để áp dụng AI vào các dự án thực tế.",
      link: "/",
    },
    {
      title: "Cộng đồng hỏi đáp",
      description: "Tham gia cộng đồng để đặt câu hỏi và chia sẻ kiến thức.",
      link: "/",
    },
  ]

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <section className="bg-linear-to-r from-blue-50 to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-5xl mx-auto text-center">
            <div className="flex items-center gap-4 mb-6 justify-center">
              <div className="h-1 w-16 bg-linear-to-r from-blue-500 to-indigo-500 rounded-full" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">
                Câu Hỏi Thường Gặp
              </h1>
            </div>
            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
              Bạn có thắc mắc về AI, cách học AI hay cách ứng dụng AI vào thực tế? Dưới đây là những câu hỏi phổ biến
              nhất mà chúng tôi tổng hợp để giúp bạn nhanh chóng tìm được câu trả lời!
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <FaQuestionCircle className="text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Câu hỏi phổ biến</h2>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} question={faq.question} answer={faq.answer} />
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-lg text-gray-700 mb-6">
                <span className="font-semibold text-blue-600">📢</span> Bạn có câu hỏi khác? Đừng ngần ngại liên hệ với
                chúng tôi.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl text-white font-medium transition-colors"
              >
                <FaEnvelope />
                Liên hệ ngay
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-10 justify-center">
              <div className="h-1 w-16 bg-linear-to-r from-blue-500 to-indigo-500 rounded-full" />
              <h2 className="text-3xl font-bold text-gray-900 bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">
                Tài nguyên liên quan
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {resources.map((resource, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{resource.title}</h3>
                  <p className="text-gray-600 mb-4">{resource.description}</p>
                  <Link
                    href={resource.link}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Xem thêm
                    <FaArrowRight className="ml-2 text-sm" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mb-24 mt-12">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-10 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10" />
            <div className="relative text-center space-y-6">
              <h3 className="text-3xl font-bold">Vẫn còn thắc mắc?</h3>
              <p className="text-lg opacity-95 max-w-xl mx-auto">
                Hãy tham gia cộng đồng của chúng tôi để được giải đáp mọi thắc mắc về AI
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/"
                  className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  Đăng ký miễn phí
                </Link>
                <Link
                  href="/"
                  className="border-2 border-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  Liên hệ với chúng tôi
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}