'use client'
import React from 'react';
import { Quote } from 'lucide-react';

const userData = [
  {"id":"cm8oew3q2000137jc4cy276se","name":"IE204SEO","email":"ie204seo@gmail.com","emailVerified":null,"image":"https://lh3.googleusercontent.com/a/ACg8ocKswwNkHBoUHLuaeWvHX9cH5EMzc6dsY-SQrb3QUP5JAPeskQ=s96-c","bio":null},
  {"id":"cm8p7ihyy0000t53f5b1dkqpl","name":"Hữu Trí Nguyễn","email":"yuuchi357@gmail.com","emailVerified":null,"image":"https://lh3.googleusercontent.com/a/ACg8ocIyi5qCXsTOe3tfpB9R2yVIhNhCs5iquEPktG7vzRMXP6U64A=s96-c","bio":null},
  {"id":"cm8xy4heu0000wnnn65b091rb","name":"Thái Tạ","email":"thaitv225@gmail.com","emailVerified":null,"image":"https://lh3.googleusercontent.com/a/ACg8ocIVcvwGNlN1ZaF2wdRixy_N8XHRfoepOGC-mol40wKmGGu1mA=s96-c","bio":null},
  {"id":"cm8y03phb002igf0t473b0m6e","name":"Tuấn Văn Lý","email":"lytuanvan55555@gmail.com","emailVerified":null,"image":"https://lh3.googleusercontent.com/a/ACg8ocKozzu3ry9eFazuEQdPCzLQ1uB_73wFpgd--ypy26UmKwRZNQ=s96-c","bio":null},
  {"id":"cm8yndotj000iet955wiyikt1","name":"Văn Lý Tuấn","email":"22521650@gm.uit.edu.vn","emailVerified":null,"image":"https://lh3.googleusercontent.com/a/ACg8ocLBQJo7ChrJ0NkjP1rDT8QnIKPkzL9HehhVLGLwXKTy0eJAvA=s96-c","bio":null},
  {"id":"cm91dqyda0000w1xe7veuasxq","name":"Anh Trần Việt","email":"22520081@gm.uit.edu.vn","emailVerified":null,"image":"https://lh3.googleusercontent.com/a/ACg8ocI0-fp-7mrCF3rwClf8Lu7re_BNretqnM0wdgG9-fmxtwOawHU=s96-c","bio":null},
  {"id":"cm99bmj830000lrw7dcblau56","name":"Tiên Mai Võ Hoài","email":"22521468@gm.uit.edu.vn","emailVerified":null,"image":"https://lh3.googleusercontent.com/a/ACg8ocIiJdVwfDqYoVNMPPdwG5yCKh1IK3M0AKmuZRBsQIA7rwTdD_A=s96-c","bio":null},
  {"id":"cm9chxrh40000pnv3f6jt7lk9","name":"Hoàng Anh Dương Phạm","email":"dphoanganh109@gmail.com","emailVerified":null,"image":"https://lh3.googleusercontent.com/a/ACg8ocJpz1AcY5Q5IO7zNsZnb7ETzXxXWg7Z1VnRfZIG8KRI19tnSfA=s96-c","bio":null},
  {"id":"cm9dmop3f00001079j3qlqw3g","name":"Lê Minh Khang","email":"khangzuo@gmail.com","emailVerified":null,"image": "https://lh3.googleusercontent.com/a/ACg8ocLxeo74P6gDwxL_GrFcSvY1fNCnPud2a4pt82ilbovFDfu5fqkr=s96-c","bio":null},
  {"id":"cm9i44a2t00007gusak3tn6mw","name":"Thái Tạ Văn","email":"22521377@gm.uit.edu.vn","emailVerified":null,"image":"https://lh3.googleusercontent.com/a/ACg8ocJL7fGO7Y-Et_aRjnqhDyHwlSObiiAc-D9NZuXiapNTZq7IUQ=s96-c","bio":null}
];

interface TestimonialContent {
  quote: string;
  role: string;
  platform: 'twitter' | 'linkedin' | 'facebook';
  date: string;
  rating?: number;
}

interface Testimonial extends TestimonialContent {
    id: string;
    name: string;
    avatar: string;
}

const TestimonialSection = () => {
  const testimonialContentTemplates: TestimonialContent[] = [
    {
      quote: "Bloai giúp mình học machine learning dễ hiểu hơn với các bài viết giải thích trực quan. Đặc biệt thích series về neural network cơ bản, rất phù hợp cho sinh viên như mình!",
      role: "Sinh viên AI tại UIT",
      platform: "facebook",
      date: "15/05/2024",
      rating: 5
    },
    {
      quote: "Là người mới bắt đầu với deep learning, mình đánh giá cao cách Bloai trình bày các khái niệm phức tạp một cách đơn giản. Bài về CNN và ứng dụng trong computer vision rất hữu ích!",
      role: "Sinh viên năm 3 ngành AI",
      platform: "twitter",
      date: "22/05/2024",
      rating: 4
    },
    {
      quote: "Mình tìm thấy Bloai khi đang làm đồ án về NLP. Các hướng dẫn xử lý ngôn ngữ tự nhiên bằng Python và thư viện Transformers đã giúp mình hoàn thành project đúng hạn!",
      role: "Sinh viên Đại học Bách Khoa",
      platform: "linkedin",
      date: "01/06/2024",
      rating: 5
    },
    {
      quote: "Dù mới ra mắt nhưng Bloai đã có nhiều bài viết chất lượng về AI/ML. Mình thường xuyên chia sẻ blog này cho nhóm học tập vì nội dung phù hợp với chương trình học.",
      role: "Lớp trưởng lớp AI",
      platform: "facebook",
      date: "10/06/2024",
      rating: 4
    },
        {
          "quote": "Bài hướng dẫn xây dựng AI Assistant từ Notion của Bloai rất chi tiết và thực tế. Áp dụng kiến trúc RAG theo hướng dẫn đã giúp tôi quản lý tài nguyên cá nhân hiệu quả hơn 🚀",
          "role": "Kỹ sư Dữ liệu & AI",
          "platform": "linkedin",
          "date": "20/03/2025",
          "rating": 5
        },
        {
          "quote": "Chiến lược Prompt Kép của Bloai là 'game changer' cho công việc marketing của tôi. Nội dung tạo ra giờ thu hút và tăng tương tác hơn hẳn! Cảm ơn team Bloai!",
          "role": "Content Marketer",
          "platform": "facebook",
          "date": "18/03/2025"
        },
        {
          "quote": "Tìm thấy lộ trình 10 bước để trở thành lập trình viên chuyên nghiệp trên Bloai thật đúng lúc. Hướng dẫn rất rõ ràng và truyền cảm hứng cho mình tiếp tục cố gắng 💪",
          "role": "Sinh viên CNTT",
          "platform": "twitter",
          "date": "25/03/2025"
        },
        {
          "quote": "Bài review top công cụ AI viết content của Bloai giúp tôi chọn được công cụ phù hợp nhất, tiết kiệm hàng giờ làm việc mỗi tuần. Chất lượng nội dung cũng cải thiện đáng kể.",
          "role": "Freelancer Content Writer",
          "platform": "facebook",
          "date": "01/04/2025",
          "rating": 4
        },
        {
          "quote": "Hướng dẫn dùng Midjourney không cần Discord trên Bloai quá đỉnh! Từ giờ việc tạo ảnh AI trở nên đơn giản hơn bao giờ hết. Cực kỳ chi tiết và dễ làm theo.",
          "role": "Thiết kế Đồ họa",
          "platform": "twitter",
          "date": "05/04/2025"
        },
        {
          "quote": "Bloai là blog tiếng Việt hiếm hoi cập nhật các chủ đề nóng về AI như RAG, Prompt Engineering, và các công cụ mới nhất với kiến thức chuyên sâu nhưng dễ hiểu.",
          "role": "Độc giả thường xuyên của Bloai",
          "platform": "linkedin",
          "date": "10/04/2025",
          "rating": 5
        }
  ];

  const numberOfTestimonialsToShow = Math.min(userData.length, testimonialContentTemplates.length);

  const testimonials: any[] = testimonialContentTemplates.slice(0, numberOfTestimonialsToShow).map((template, index) => {
      const user = userData[index];
      return {
          ...template,
          id: user?.id,
          name: user?.name,
          avatar: user?.image,
      };
  });

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return <span className="text-[#1DA1F2]">Twitter</span>;
      case 'linkedin':
        return <span className="text-[#0077B5]">LinkedIn</span>;
      case 'facebook':
        return <span className="text-[#1877F2]">Facebook</span>;
      default:
        return platform;
    }
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex items-center mt-2">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const getItemSpanClasses = (index: number) => {
    let classes = 'col-span-1';
    classes += ' md:col-span-1';
    const largeColSpan = (index % 4 === 0 || index % 4 === 3) ? 'lg:col-span-2' : 'lg:col-span-1';
    classes += ` ${largeColSpan}`;
    return classes;
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#2B463C] mb-4">Người dùng nói gì về Bloai?</h2>
          <p className="text-lg text-[#554640]/80 max-w-2xl mx-auto">
            Phản hồi từ cộng đồng người dùng yêu thích công nghệ và trí tuệ nhân tạo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={getItemSpanClasses(index)}
            >
              <div className="bg-[#F8F5F2] rounded-xl p-6 h-full flex flex-col border border-gray-100">
                <Quote className="text-[#3A6B4C] w-8 h-8 mb-4" />
                <p className="text-[#554640] italic mb-6 flex-grow text-base">"{testimonial.quote}"</p>

                <div className="mt-auto">
                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4 border border-gray-200"
                    />
                    <div>
                      <h4 className="font-semibold text-[#2B463C] text-base">{testimonial.name}</h4>
                      <p className="text-sm text-[#554640]/80">{testimonial.role}</p>
                      <p className="text-xs text-[#554640]/60 mt-1">
                        Đăng trên {getPlatformIcon(testimonial.platform)} • {testimonial.date}
                      </p>
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 text-sm text-[#554640]/60">
          <p>
            Bloai - Nền tảng chia sẻ kiến thức AI/ML, cập nhật xu hướng công nghệ mới nhất.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;