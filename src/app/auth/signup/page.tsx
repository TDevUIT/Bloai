'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, LockKeyhole, User } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';

const SignUpPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    try {
      await signIn('google', { callbackUrl });
    } catch (error) {
      setError('Xác thực với Google không thành công');
    }
  };

  const handleGithubLogin = async () => {
    try {
      await signIn('github', { callbackUrl });
    } catch (error) {
      setError('Xác thực với GitHub không thành công');
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
        name,
        callbackUrl,
        type: 'signup',
      });

      if (res?.error) {
        setError(res.error);
      } else {
        router.push(callbackUrl);
      }
    } catch (error) {
      setError('Đã xảy ra lỗi không mong muốn');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full max-w-md p-8"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 font-mono">
          Tham gia Devlife
        </h1>
        <p className="text-gray-600">
          Bắt đầu chia sẻ hành trình phát triển của bạn
        </p>
      </div>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </motion.div>
      )}

      <form onSubmit={handleEmailSubmit} className="space-y-5">
        <div className="flex flex-col space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Tên
          </label>
          <div className="inputForm border border-gray-200 rounded-lg h-12 flex items-center pl-3 transition-all focus-within:border-blue-500">
            <User className="h-5 w-5 text-gray-500" aria-hidden="true" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input ml-3 border-none rounded-lg w-full h-full focus:outline-hidden bg-[#e8e8e8] placeholder-gray-400"
              placeholder="Tên của bạn"
              required
            />
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Địa chỉ email
          </label>
          <div className="inputForm border border-gray-200 rounded-lg h-12 flex items-center pl-3 transition-all focus-within:border-blue-500">
            <Mail className="h-5 w-5 text-gray-500" aria-hidden="true" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input ml-3 border-none rounded-lg w-full h-full focus:outline-hidden bg-[#e8e8e8] placeholder-gray-400"
              placeholder="you@example.com"
              required
            />
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Mật khẩu
          </label>
          <div className="inputForm border border-gray-200 rounded-lg h-12 flex items-center pl-3 transition-all focus-within:border-blue-500">
            <LockKeyhole className="h-5 w-5 text-gray-500" aria-hidden="true" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input ml-3 border-none rounded-lg w-full h-full focus:outline-hidden bg-[#e8e8e8] placeholder-gray-400"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
        </div>

        <div className="flex flex-row items-center space-x-2 justify-between mb-4">
          <div className='flex justify-center items-center gap-2'>
            <Checkbox id="terms" required />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Tôi đồng ý với Điều khoản và Điều kiện
            </label>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full bg-linear-to-br from-purple-600 to-blue-500 text-white
                    py-3 px-6 rounded-lg hover:shadow-lg transition-all font-medium
                    focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Tạo tài khoản
        </motion.button>
      </form>

      <p className="text-center text-gray-900 text-sm mt-6 mb-2">Hoặc với</p>
      <div className="flex flex-row space-x-4 mt-4">
        <button
          onClick={handleGoogleLogin}
          className="btn google mt-2 w-full h-12 rounded-lg flex justify-center items-center space-x-2 font-medium border border-gray-200 bg-[#e8e8e8] cursor-pointer transition-all hover:border-blue-500"
        >
          <FcGoogle className="text-xl" />
          <span>Google</span>
        </button>
        <button
          onClick={handleGithubLogin}
          className="btn github mt-2 w-full h-12 rounded-lg flex justify-center items-center space-x-2 font-medium border border-gray-200 bg-[#e8e8e8] cursor-pointer transition-all hover:border-blue-500"
        >
          <FaGithub className="text-xl" />
          <span>GitHub</span>
        </button>
      </div>

      <p className="mt-6 text-center text-gray-600 text-sm">
        Đã có tài khoản? {' '}
        <Link
          href="/auth/signin"
          className="text-blue-600 hover:text-blue-700 underline font-medium transition-colors"
        >
          Đăng nhập
        </Link>
      </p>
    </motion.div>
  );
};

export default SignUpPage;