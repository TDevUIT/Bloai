'use client';
import React, { ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { generateTitleBlog } from '@/lib/action';
import { AIGenerationButton } from './AIGenerationButton';

interface TitleSlugInputProps {
    title: string;
    onTitleChange: (e: ChangeEvent<HTMLInputElement>) => void;
    setTitle: React.Dispatch<React.SetStateAction<string>>; 
    slug: string;
    onSlugChange: (e: ChangeEvent<HTMLInputElement>) => void;
    isGeneratingSlugManually: boolean;
    onToggleManualSlug: () => void;
    isGeneratingTitle: boolean;
    setIsGeneratingTitle: React.Dispatch<React.SetStateAction<boolean>>;
    contentForAI: string;
}

export const TitleSlugInput: React.FC<TitleSlugInputProps> = ({
    title,
    onTitleChange,
    setTitle, 
    slug,
    onSlugChange,
    isGeneratingSlugManually,
    onToggleManualSlug,
    isGeneratingTitle,
    setIsGeneratingTitle,
    contentForAI,
}) => {

    const handleGenerateTitle = async (content: string) => {
        try {
            const generatedTitle = await generateTitleBlog(content);
            if (generatedTitle) setTitle(generatedTitle);
            return generatedTitle;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    return (
        <>
            <div className="space-y-1.5">
                <Label htmlFor="title" className="flex items-center gap-2 text-base">
                    Tiêu đề *
                    <AIGenerationButton
                        label="Tiêu đề"
                        action={handleGenerateTitle}
                        isGenerating={isGeneratingTitle}
                        setIsGenerating={setIsGeneratingTitle}
                        contentForAI={contentForAI}
                    />
                </Label>
                <Input
                    id="title"
                    placeholder="Nhập tiêu đề bài viết"
                    value={title}
                    onChange={onTitleChange}
                    className="text-lg font-medium"
                    maxLength={70}
                    required
                    aria-required="true"
                />
                <p className="text-xs text-muted-foreground">Còn lại {70 - title.length} ký tự (khuyến nghị SEO)</p>
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="slug" className="flex items-center gap-2 text-base">
                    Đường dẫn (Slug) *
                    <button
                        type="button"
                        onClick={onToggleManualSlug}
                        className="text-xs text-blue-600 hover:underline focus:outline-hidden"
                    >
                        {isGeneratingSlugManually ? 'Tạo tự động' : 'Chỉnh sửa'}
                    </button>
                </Label>
                <Input
                    id="slug"
                    value={slug}
                    onChange={onSlugChange}
                    disabled={!isGeneratingSlugManually}
                    required
                    aria-required="true"
                    placeholder="duong-dan-bai-viet"
                />
            </div>
        </>
    );
};