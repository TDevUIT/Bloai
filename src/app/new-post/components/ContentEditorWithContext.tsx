'use client';
import React, { useCallback } from 'react';
import { Label } from '@/components/ui/label';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { EditorWrapper } from './EditorWrapper'; 

interface ContentEditorWithContextProps {
    content: string;
    onContentChange: (value: string | undefined) => void;
    readTime: number;
}

export const ContentEditorWithContext: React.FC<ContentEditorWithContextProps> = ({
    content,
    onContentChange,
    readTime,
}) => {
    const insertMarkdown = useCallback((format: string) => {
        const examples: Record<string, string> = {
            bold: '**chữ đậm**', italic: '*chữ nghiêng*', link: '[tiêu đề](https://)',
            code: '`mã`', image: '![alt](https://)', list: '\n- Mục danh sách',
        };
        onContentChange((content ?? '') + ` ${examples[format] ?? ''}`);
    }, [onContentChange, content]);


    return (
        <div className="space-y-1.5">
            <Label htmlFor="content-editor" id="content-editor-label" className="flex items-center gap-2 text-base">
                Nội dung * <span className="text-sm text-muted-foreground">(~{readTime} phút đọc)</span>
            </Label>
            <ContextMenu>
                <ContextMenuTrigger>
                    <EditorWrapper
                        value={content}
                        onChange={onContentChange}
                        aria-labelledby="content-editor-label"
                    />
                </ContextMenuTrigger>
                <ContextMenuContent>
                    <ContextMenuItem onSelect={() => insertMarkdown('bold')}>Đậm</ContextMenuItem>
                    <ContextMenuItem onSelect={() => insertMarkdown('italic')}>Nghiêng</ContextMenuItem>
                    <ContextMenuItem onSelect={() => insertMarkdown('link')}>Liên kết</ContextMenuItem>
                    <ContextMenuItem onSelect={() => insertMarkdown('image')}>Hình ảnh</ContextMenuItem>
                    <ContextMenuItem onSelect={() => insertMarkdown('code')}>Mã</ContextMenuItem>
                    <ContextMenuItem onSelect={() => insertMarkdown('list')}>Danh sách</ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
        </div>
    );
};