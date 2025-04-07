"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { FaArrowLeft, FaBook, FaLock, FaShieldAlt } from "react-icons/fa"

export default function TermsAndPrivacy() {
  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Header */}
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center gap-4 mb-6 justify-center">
            <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" />
            <h1 className="text-3xl font-bold text-gray-900 bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Điều khoản sử dụng & Chính sách bảo mật
            </h1>
            <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" />
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Chúng tôi cam kết bảo vệ quyền riêng tư và thông tin cá nhân của bạn. Vui lòng đọc kỹ các điều khoản dưới
            đây.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Terms of Use */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-2xl shadow-md"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                <FaBook className="text-xl" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">1. Điều khoản sử dụng</h2>
            </div>

            <div className="space-y-6">
              <div className="flex gap-3">
                <div className="text-blue-600 flex-shrink-0">🔹</div>
                <p className="text-gray-700">
                  Khi truy cập và sử dụng blog, bạn đồng ý với các điều khoản về nội dung, quyền riêng tư và bản quyền.
                </p>
              </div>

              <div className="space-y-4 mt-6">
                <h3 className="font-medium text-gray-900">Quy định về nội dung</h3>
                <p className="text-gray-700">
                  Người dùng không được đăng tải nội dung vi phạm pháp luật, xúc phạm, quấy rối hoặc có tính chất phân
                  biệt đối xử.
                </p>

                <h3 className="font-medium text-gray-900">Quyền sở hữu trí tuệ</h3>
                <p className="text-gray-700">
                  Tất cả nội dung trên BloAI đều thuộc quyền sở hữu của chúng tôi. Việc sao chép, phân phối mà không có
                  sự cho phép đều bị nghiêm cấm.
                </p>

                <h3 className="font-medium text-gray-900">Trách nhiệm người dùng</h3>
                <p className="text-gray-700">
                  Người dùng chịu trách nhiệm về bảo mật tài khoản và mọi hoạt động diễn ra dưới tài khoản của mình.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Privacy Policy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-8 rounded-2xl shadow-md"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
                <FaShieldAlt className="text-xl" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">2. Chính sách bảo mật</h2>
            </div>

            <div className="space-y-6">
              <div className="flex gap-3">
                <div className="text-purple-600 flex-shrink-0">🔹</div>
                <p className="text-gray-700">Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn.</p>
              </div>

              <div className="flex gap-3">
                <div className="text-purple-600 flex-shrink-0">🔹</div>
                <p className="text-gray-700">
                  Mọi thông tin đăng ký chỉ được sử dụng cho mục đích cung cấp nội dung tốt hơn.
                </p>
              </div>

              <div className="space-y-4 mt-6">
                <h3 className="font-medium text-gray-900">Thông tin thu thập</h3>
                <p className="text-gray-700">
                  Chúng tôi thu thập thông tin cá nhân như tên, email và các dữ liệu tương tác để cải thiện trải nghiệm
                  người dùng.
                </p>

                <h3 className="font-medium text-gray-900">Bảo mật dữ liệu</h3>
                <p className="text-gray-700">
                  Chúng tôi áp dụng các biện pháp bảo mật tiên tiến để bảo vệ dữ liệu người dùng khỏi truy cập trái
                  phép.
                </p>

                <h3 className="font-medium text-gray-900">Chia sẻ thông tin</h3>
                <p className="text-gray-700">
                  Chúng tôi không bán hoặc chia sẻ thông tin cá nhân của bạn cho bên thứ ba mà không có sự đồng ý.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Read More Section */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              <FaLock className="text-lg" />
            </div>
            <div className="text-left">
              <p className="text-gray-700">
                <span className="font-medium text-blue-600">📌 Đọc chi tiết tại đây:</span>{" "}
                <Link href="/" className="text-blue-600 underline hover:text-blue-700">
                  Xem Chính sách
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 text-center text-gray-500 text-sm">
          <p>© 2025 BloAI. Bản quyền thuộc về nhóm sinh viên UIT.</p>
          <p className="mt-2">
            Liên hệ:{" "}
            <a href="mailto:ie204seo@gmail.com" className="text-blue-600">
              ie204seo@gmail.com
            </a>
          </p>
        </footer>
      </div>
    </main>
  )
}

