'use client';
import React, { useState, useCallback, useEffect, ChangeEvent } from 'react';
import { Dropzone } from '@/components/Dropzone'; 
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { TrashIcon } from 'lucide-react';

interface ThumbnailUploaderProps {
    thumbnail: File | null;
    onThumbnailChange: (file: File | null) => void;
    imageAlt: string;
    onImageAltChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    isSEOValid: boolean; 
}

export const ThumbnailUploader: React.FC<ThumbnailUploaderProps> = ({
    thumbnail,
    onThumbnailChange,
    imageAlt,
    onImageAltChange,
    isSEOValid,
}) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        let objectUrl: string | null = null;
        if (thumbnail) {
            objectUrl = URL.createObjectURL(thumbnail);
            setPreviewUrl(objectUrl);
        } else {
            setPreviewUrl(null);
        }

        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
                 setPreviewUrl(null); 
            }
        };
    }, [thumbnail]);

    const handleFileDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0 && acceptedFiles[0]) {
            onThumbnailChange(acceptedFiles[0]);
        } else {
            onThumbnailChange(null); 
        }
    }, [onThumbnailChange]);

    const handleRemoveThumbnail = useCallback(() => {
        onThumbnailChange(null);
    }, [onThumbnailChange]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="gap-y-1.5">
                <Label htmlFor="thumbnail-dropzone" className="text-base">Ảnh thu nhỏ *</Label>
                <Dropzone
                    id="thumbnail-dropzone"
                    onDrop={handleFileDrop}
                    accept="image/png, image/jpeg, image/webp, image/avif"
                    maxFiles={1}
                    maxSize={5 * 1024 * 1024} 
                    aria-label="Tải lên ảnh thu nhỏ"
                />
                {!isSEOValid && !thumbnail && <p className="text-xs text-red-600 pt-1 ">Vui lòng chọn ảnh thu nhỏ.</p>}
            </div>
            <div className="gap-y-4">
                {previewUrl ? (
                    <div className="relative space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Xem trước:</p>
                        <div className="relative aspect-video rounded-lg overflow-hidden border border-dashed border-muted">
                            <img src={previewUrl} alt="Xem trước ảnh thu nhỏ" className="object-cover w-full h-full" />
                            <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={handleRemoveThumbnail} aria-label="Xóa ảnh thu nhỏ đã chọn">
                                <TrashIcon className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                        <div className="space-y-1.5 pt-2">
                            <Label htmlFor="imageAlt" className="flex items-center gap-2 text-base">
                                Alt Text (SEO) <span className="text-xs text-muted-foreground">({imageAlt.length}/125 ký tự)</span>
                            </Label>
                            <Textarea
                                id="imageAlt"
                                placeholder="Mô tả hình ảnh cho SEO..."
                                value={imageAlt}
                                onChange={onImageAltChange}
                                rows={2}
                                className="resize-none text-sm"
                                maxLength={125}
                            />
                            <p className="text-xs text-muted-foreground">Mô tả ngắn gọn nội dung ảnh.</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full border border-dashed rounded-lg text-muted-foreground text-sm bg-muted/40  min-h-[150px] md:min-h-[200px]">Xem trước ảnh thu nhỏ</div>
                )}
            </div>
        </div>
    );
};