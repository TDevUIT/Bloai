'use client'
import React, { memo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/Snipper';
import { toast } from 'react-toastify';

interface AIGenerationButtonProps {
    label: string;
    action: (content: string) => Promise<string | null | undefined>;
    isGenerating: boolean;
    setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
    contentForAI: string; 
    disabled?: boolean;
    requiresContent?: boolean; 
}

const AIGenerationButtonComponent: React.FC<AIGenerationButtonProps> = ({
    label,
    action,
    isGenerating,
    setIsGenerating,
    contentForAI,
    disabled = false,
    requiresContent = true,
}) => {
    const handleClick = useCallback(async () => {
        if (requiresContent && !contentForAI) {
            toast.info("Vui lòng nhập nội dung chính trước khi tạo bằng AI.");
            return;
        }
        setIsGenerating(true);
        try {
            const generated = await action(contentForAI);
            if (generated) {
                 if (label === "Từ khóa SEO") {
                    toast.success(`${label} đã được tạo thành công bằng AI.`);
                 } else {
                    toast.success(`${label} đã được tạo thành công bằng AI.`);
                 }
            } else {
                toast.warn(`AI không thể tạo ${label}. Vui lòng thử lại hoặc viết thủ công.`);
            }
        } catch (error) {
            console.error(`Error generating ${label}:`, error);
            toast.error(`Lỗi khi tạo ${label} bằng AI: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsGenerating(false);
        }
    }, [action, contentForAI, setIsGenerating, label, requiresContent]);

    return (
        <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-700 h-auto px-2 py-1 text-xs"
            onClick={handleClick}
            disabled={isGenerating || disabled}
            aria-label={`Tạo ${label} bằng AI`}
        >
            {isGenerating ? (
                <span className="flex items-center gap-1">
                    <Spinner className="h-3 w-3" />
                    Đang tạo...
                </span>
            ) : (
                "Tạo AI"
            )}
        </Button>
    );
};

export const AIGenerationButton = memo(AIGenerationButtonComponent);
AIGenerationButton.displayName = 'AIGenerationButton';