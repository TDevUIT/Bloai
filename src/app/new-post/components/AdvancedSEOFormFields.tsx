'use client';
import React, { ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { generateOpenGraphTitle, generateOpenGraphDescription } from '@/lib/action';
import { AIGenerationButton } from './AIGenerationButton';

interface AdvancedSEOFormFieldsProps {
    canonicalUrl: string;
    onCanonicalUrlChange: (e: ChangeEvent<HTMLInputElement>) => void;
    isAutoCanonical: boolean;
    setIsAutoCanonical: React.Dispatch<React.SetStateAction<boolean>>;
    ogTitle: string;
    onOgTitleChange: (e: ChangeEvent<HTMLInputElement>) => void;
    setOgTitle: React.Dispatch<React.SetStateAction<string>>; 
    ogDescription: string;
    onOgDescriptionChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    setOgDescription: React.Dispatch<React.SetStateAction<string>>;
    isGeneratingOgTitle: boolean;
    setIsGeneratingOgTitle: React.Dispatch<React.SetStateAction<boolean>>;
    isGeneratingOgDescription: boolean;
    setIsGeneratingOgDescription: React.Dispatch<React.SetStateAction<boolean>>;
    slug: string; 
    contentForAI: string;
}

export const AdvancedSEOFormFields: React.FC<AdvancedSEOFormFieldsProps> = ({
    canonicalUrl,
    onCanonicalUrlChange,
    isAutoCanonical,
    setIsAutoCanonical,
    ogTitle,
    onOgTitleChange,
    setOgTitle,
    ogDescription,
    onOgDescriptionChange,
    setOgDescription,
    isGeneratingOgTitle,
    setIsGeneratingOgTitle,
    isGeneratingOgDescription,
    setIsGeneratingOgDescription,
    slug,
    contentForAI,
}) => {
    const handleResetCanonical = () => {
        setIsAutoCanonical(true);
     
    };

    const handleGenerateOgTitle = async (content: string) => {
        try {
            const generated = await generateOpenGraphTitle(content);
            if (generated) setOgTitle(generated);
            return generated;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const handleGenerateOgDesc = async (content: string) => {
        try {
            const generated = await generateOpenGraphDescription(content);
            if (generated) setOgDescription(generated);
            return generated;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    return (
        <div className="space-y-4">
            <Label className="text-lg font-semibold">SEO Nâng cao</Label>
            <div className="space-y-1.5">
                <Label htmlFor="canonicalUrl" className="flex items-center gap-2 text-sm">
                    URL Canonical
                    {!isAutoCanonical && (
                        <Button type="button" variant="link" size="sm" className="text-blue-600 hover:text-blue-700 h-auto p-0 text-xs" onClick={handleResetCanonical}>
                            Đặt lại tự động
                        </Button>
                    )}
                </Label>
                <Input
                    id="canonicalUrl"
                    placeholder="Để trống để tạo tự động"
                    value={canonicalUrl}
                    onChange={onCanonicalUrlChange} 
                    className="text-sm"
                />
                {isAutoCanonical && <p className="text-xs text-muted-foreground">Tự động tạo từ đường dẫn (slug).</p>}
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="ogTitle" className="flex items-center gap-2 text-sm">
                    OG Title
                    <AIGenerationButton
                        label="OG Title"
                        action={handleGenerateOgTitle}
                        isGenerating={isGeneratingOgTitle}
                        setIsGenerating={setIsGeneratingOgTitle}
                        contentForAI={contentForAI}
                        requiresContent={true}
                    /> 
                </Label>
                <Input
                    id="ogTitle"
                    value={ogTitle}
                    onChange={onOgTitleChange}
                    placeholder="Tiêu đề hiển thị khi chia sẻ mạng xã hội"
                    className="text-sm"
                    maxLength={60}
                />
                 <p className="text-xs text-muted-foreground">Còn lại {60 - (ogTitle?.length ?? 0)} ký tự</p>
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="ogDescription" className="flex items-center gap-2 text-sm">
                    OG Description
                    <AIGenerationButton
                        label="OG Description"
                        action={handleGenerateOgDesc}
                        isGenerating={isGeneratingOgDescription}
                        setIsGenerating={setIsGeneratingOgDescription}
                        contentForAI={contentForAI}
                        requiresContent={true}
                    />
                </Label>
                <Textarea
                    id="ogDescription"
                    value={ogDescription}
                    onChange={onOgDescriptionChange}
                    rows={2}
                    placeholder="Mô tả hiển thị khi chia sẻ mạng xã hội"
                    className="text-sm"
                    maxLength={155}
                />
                <p className="text-xs text-muted-foreground">Còn lại {155 - (ogDescription?.length ?? 0)} ký tự</p>
            </div>
        </div>
    );
};