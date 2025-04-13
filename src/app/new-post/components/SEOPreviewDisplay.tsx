'use client'; 
import React from 'react';
import { Label } from '@/components/ui/label';
import { env } from '@/env'; // Import env

interface SEOPreviewDisplayProps {
    title: string;
    slug: string;
    metaDescription: string;
}

export const SEOPreviewDisplay: React.FC<SEOPreviewDisplayProps> = ({
    title,
    slug,
    metaDescription,
}) => {
    const baseUrl = env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'; 
    const displayUrl = `${baseUrl}/blog/${slug || 'duong-dan-bai-viet'}`;

    return (
        <div className="space-y-3">
            <Label className="text-lg font-semibold">Xem trước SEO (Google)</Label>
            <div className="p-4 bg-background rounded-lg border space-y-1 text-sm">
                <p className="font-medium text-blue-700 truncate">{title || 'Tiêu đề bài viết'}</p>
                <p className="text-xs text-green-700 truncate">{displayUrl}</p>
                <p className="text-gray-600 line-clamp-2">{metaDescription || 'Meta mô tả của bài viết sẽ hiển thị ở đây. Tối ưu độ dài khoảng 120-160 ký tự.'}</p>
            </div>
        </div>
    );
};