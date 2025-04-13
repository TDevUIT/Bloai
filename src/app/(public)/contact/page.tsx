import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { contactPageSchemaLd, safeJsonLdStringify } from "@/config/seo"

const ContactPage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(contactPageSchemaLd)}}
      />
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-6">
          <div className="relative inline-block">
            <h1 className="text-5xl font-bold text-gray-900 bg-clip-text bg-linear-to-r from-primary to-blue-600">
              Liên Hệ Với Chúng Tôi
            </h1>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 h-1 w-24 bg-primary rounded-full" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Chúng tôi luôn sẵn sàng hỗ trợ và lắng nghe ý kiến của bạn. Hãy điền form bên dưới hoặc liên hệ trực tiếp qua thông tin có sẵn.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <Card className="p-8 bg-white shadow-none hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 pb-4 border-b-2 border-primary">
                Thông Tin Liên Hệ
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-6">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email hỗ trợ</p>
                    <a href="mailto:ie204seo@gmail.com" className="text-lg font-medium text-gray-700 hover:text-primary transition-colors">
                      ie204seo@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <svg className="h-8 w-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Mã nguồn dự án</p>
                    <a 
                      href="https://github.com/TDevUIT/Bloai" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-lg font-medium text-gray-700 hover:text-primary transition-colors"
                    >
                      GitHub Repository
                    </a>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-white shadow-none">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 pb-4 border-b-2 border-primary">
                Gửi Tin Nhắn
              </h2>
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 font-medium">Họ và tên</Label>
                  <Input 
                    id="name" 
                    className="focus:ring-2 focus:ring-primary focus:border-primary h-12"
                    placeholder="Nhập họ tên đầy đủ"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    className="focus:ring-2 focus:ring-primary focus:border-primary h-12"
                    placeholder="example@email.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-gray-700 font-medium">Tiêu đề</Label>
                  <Input 
                    id="subject" 
                    className="focus:ring-2 focus:ring-primary focus:border-primary h-12"
                    placeholder="Nhập tiêu đề liên hệ"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-gray-700 font-medium">Nội dung</Label>
                  <Textarea 
                    id="message" 
                    rows={5} 
                    className="focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                    placeholder="Mô tả chi tiết nội dung cần hỗ trợ..."
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg bg-black text-white hover:bg-primary/90 transition-transform hover:scale-[1.02]"
                >
                  Gửi Thông Điệp
                  <svg 
                    className="ml-2 w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </Button>
              </form>
            </Card>
          </div>

          <Card className="p-8 bg-white shadow-none h-full flex flex-col">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 pb-4 border-b-2 border-primary">
              Địa Chỉ Liên Lạc
            </h2>
            <div className="space-y-6 flex-1">
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-600 leading-relaxed">
                  <span className="block font-semibold text-lg mb-2 text-gray-800">Trường Đại học CNTT - ĐHQG TP.HCM</span>
                  Khu phố 6, Phường Linh Trung<br />
                  Thành phố Thủ Đức, TP.HCM<br />
                  <span className="block mt-2 text-primary">✆ Hotline: (028) 372 52002</span>
                </p>
              </div>
              
              <div className="aspect-video rounded-xl overflow-hidden border-2 border-gray-200 shadow-md">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.231357709644!2d106.80027651533625!3d10.870008392270836!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317527587e9ad5bf%3A0xafa66f9c8be3c91!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBuZ2jhu4cgVGjDtG5nIEPGsG5nIDQtVFAuSENNIChVSVQp!5e0!3m2!1svi!2s!4v1717585435951!5m2!1svi!2s" 
                  className="w-full h-full"
                  style={{ filter: "grayscale(20%) contrast(110%) saturate(120%)" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              
              <div className="bg-primary/5 p-6 rounded-lg mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Giờ Làm Việc</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex justify-between">
                    <span>Thứ 2 - Thứ 6</span>
                    <span>8:00 - 17:00</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Thứ 7</span>
                    <span>8:00 - 12:00</span>
                  </li>
                  <li className="flex justify-between text-red-500">
                    <span>Chủ Nhật</span>
                    <span>Nghỉ</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
    </>
    
  )
}

export default ContactPage;