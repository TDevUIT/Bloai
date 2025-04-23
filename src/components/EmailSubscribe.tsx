'use client'
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { api } from '@/trpc/react';

interface EmailSubscribeSectionProps {
  title?: string;
  description?: string;
  className?: string;
}

const EmailSubscribeSection = ({
  title = "Khám Phá Thế Giới AI Cùng Bloai",
  description = "Trở thành một phần của cộng đồng đam mê AI tại Bloai! Đăng ký nhận bản tin hàng tuần để cập nhật những thông tin giá trị về trí tuệ nhân tạo.",
  className = "",
}: EmailSubscribeSectionProps) => {
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  const subscribeMutation = api.blog.subscribeToNewsletter.useMutation({
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: () => {
      toast.success('Đăng ký nhận bản tin thành công! Cảm ơn bạn.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setEmail('');
    },
    onError: (error) => {
      toast.error(`Đăng ký thất bại: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.warning('Vui lòng nhập địa chỉ email', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    subscribeMutation.mutate({ email });
  };

  return (
    <section className={`bg-[#F8F5F2] rounded-lg p-8 ${className}`}>
      <div className="max-w-2xl mx-auto text-center">
        <h3 className="text-2xl font-bold text-[#2B463C] mb-3">{title}</h3>
        <p className="text-[#554640]/90 mb-6">{description}</p>
        
        <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleSubmit}>
          <div className="relative flex-grow">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#554640]" />
            <Input
              type="email"
              placeholder='Nhập email của bạn'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 focus:ring-2 focus:ring-[#3A6B4C] rounded-lg h-12"
              aria-label="Email đăng ký nhận bản tin"
              disabled={isLoading}
              required
            />
          </div>
          <Button 
            type="submit" 
            className="bg-[#3A6B4C] hover:bg-[#2E5540] text-white h-12 px-6"
            disabled={isLoading}
            size="lg"
          >
            {isLoading ? (
              'Đang gửi...'
            ) : (
              <>
                Đăng ký ngay
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
        
        <p className="text-xs text-[#554640]/60 mt-3">
          Chúng tôi tôn trọng quyền riêng tư của bạn. Bạn có thể hủy đăng ký bất cứ lúc nào.
        </p>
      </div>
    </section>
  );
};

export default EmailSubscribeSection;