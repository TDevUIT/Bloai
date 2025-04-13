'use client';

import React, { useCallback } from 'react';
import dynamic from 'next/dynamic';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { getNodeText, Heading } from '@/types/helper.type';

const DynamicReactMarkdown = dynamic(
    () => import('react-markdown').then(mod => mod.default),
    {
        loading: () => <div className='prose max-w-none'><p>Loading content...</p></div>,
        ssr: false
    }
);

interface BlogContentRendererProps {
    content: string;
    headings: Heading[];
}

const BlogContentRenderer: React.FC<BlogContentRendererProps> = ({ content, headings }) => {

    const CustomHeadingRenderer = useCallback(
        ({
            level,
            children,
            ...props
        }: {
            level: 1 | 2 | 3;
            children?: React.ReactNode;
            [key: string]: any;
        }) => {
            const text = children ? getNodeText(children) : '';
            const matchedHeading = headings.find((h) => h.text === text && h.level === level);
            const finalId = matchedHeading?.id;

            const Tag = `h${level}` as keyof JSX.IntrinsicElements;

            if (!finalId) {
                console.warn(`Heading ID not found for level ${level}: "${text}"`);
                return <Tag {...props}>{children || ''}</Tag>;
            }

            return (
                <Tag id={finalId} {...props} key={finalId}>
                {children || ''}
                </Tag>
            );
        },
        [headings] 
    );

    return (
        <div className="prose prose-slate max-w-none lg:prose-lg prose-headings:scroll-mt-24 prose-img:rounded-lg prose-img:shadow-md prose-a:text-blue-600 prose-a:hover:text-blue-800 prose-a:transition-colors prose-a:duration-150 prose-code:before:content-none prose-code:after:content-none mb-12">
            <DynamicReactMarkdown
                rehypePlugins={[rehypeRaw]}
                remarkPlugins={[remarkGfm]}
                components={{
                    h1: (props) => <CustomHeadingRenderer level={1} {...props} />,
                    h2: (props) => <CustomHeadingRenderer level={2} {...props} />,
                    h3: (props) => <CustomHeadingRenderer level={3} {...props} />,
                }}
            >
                {content}
            </DynamicReactMarkdown>
        </div>
    );
};

export default BlogContentRenderer;