import Image from 'next/image';
import Link from 'next/link';
import { FaTwitter, FaGithub, FaLinkedinIn } from 'react-icons/fa';
import Logo from './logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Danh mục', href: '/categories' },
    { name: 'Về chúng tôi', href: '/about' },
    { name: 'Liên hệ', href: '/contact' },
    
  ];

  const socials = [
    { name: 'Twitter', href: '#', icon: <FaTwitter /> },
    { name: 'GitHub', href: '#', icon: <FaGithub /> },
    { name: 'LinkedIn', href: '#', icon: <FaLinkedinIn /> },
  ];

  return (
    <footer className="bg-gray-50 border-t-2 border-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-3 md:grid-cols-3 gap-8 mb-8">

          <div className="space-y-2">
            <Link href="/" className="text-xl font-bold hover:text-gray-600">
              <Logo />
            </Link>
            <p className="text-sm text-gray-600">
              Bài viết sâu sắc về công nghệ, thiết kế và phát triển.
            </p>
          </div>

          <div className="md:pl-8">
            <h3 className="font-medium mb-3">Liên kết nhanh</h3>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              {links.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-600 hover:underline">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-3">Kết nối</h3>
            <div className="flex gap-4 text-gray-600">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="hover:text-gray-900 text-xl"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
          © {currentYear} Bloai. Đã đăng ký bản quyền.
        </div>
      </div>
    </footer>
  );
};

export default Footer;