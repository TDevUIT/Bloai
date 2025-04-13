import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaTwitter, FaFacebook, FaLinkedin } from 'react-icons/fa';
import { Author } from '@/types/helper.type';

interface AuthorCardProps {
    author: Author | null;
    className?: string;
    imageSize?: number;
    showSocials?: boolean;
}

const AuthorCard: React.FC<AuthorCardProps> = ({
    author,
    className = '',
    imageSize = 96,
    showSocials = true,
}) => {
    if (!author) return null;

    const socialLinks = [
        { platform: 'Twitter', url: author.socials?.twitter, Icon: FaTwitter, label: "Author's Twitter Profile" },
        { platform: 'Facebook', url: author.socials?.facebook, Icon: FaFacebook, label: "Author's Facebook Profile" },
        { platform: 'LinkedIn', url: author.socials?.linkedin, Icon: FaLinkedin, label: "Author's LinkedIn Profile" },
    ].filter(link => link.url);

    return (
        <div className={`flex flex-col items-center text-center ${className}`}>
            <Image
                src={author.image || '/fallback-avatar.png'}
                alt={author.name ? `${author.name}'s Avatar` : 'Author Avatar'}
                width={imageSize}
                height={imageSize}
                className="rounded-full object-cover mb-4 border-4"
                priority={imageSize > 80}
                quality={80}
                unoptimized={!author.image || author.image.startsWith('/')}
            />
            <h3 className="text-xl font-bold text-gray-900 mb-2">{author.name || 'Unknown Author'}</h3>
            <p className="text-gray-600 mb-6 leading-relaxed max-w-md">
                {author.bio || 'No bio available.'}
            </p>
            {showSocials && socialLinks.length > 0 && (
                 <div className="flex gap-3 w-full items-center justify-center">
                    <div className="flex gap-2">
                        {socialLinks.map(({ platform, url, Icon, label }) => (
                             <Link
                                key={platform}
                                href={url!}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                target="_blank"
                                rel="noopener noreferrer nofollow"
                                aria-label={label}
                                title={label}
                            >
                                <Icon className="w-5 h-5" />
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuthorCard;