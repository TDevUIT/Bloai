'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Label } from '@/components/ui/label';
import { Heading } from '@/types/helper.type';

const DynamicReactMarkdown = dynamic(
    () => import('react-markdown').then(mod => mod.default),
    { ssr: false }
);

interface BlogTableOfContentsProps {
    headings: Heading[];
}

const BlogTableOfContents: React.FC<BlogTableOfContentsProps> = ({ headings }) => {
    if (!headings || headings.length === 0) {
        return null;
    }

    return (
        <div className="mb-10 p-2 border-2 md:block hidden">
            <Label className="text-xl font-bold mb-4 text-orange-700 flex items-center gap-2 pb-2 border-b-2 ">
                <span className="p-2 rounded-full">📦</span>
                Mục lục
            </Label>
            <nav aria-label="Table of contents ">
                <ul className="space-y-1.5 text-sm max-h-auto overflow-auto scroll-custom pr-3">
                    {headings.map((heading) => (
                        <li
                            key={heading.id}
                            className="relative transition-transform hover:translate-x-1"
                        >
                            <Link
                                href={`#${heading.id}`}
                                className={`
                                    flex items-center text-gray-700 hover:text-orange-600
                                    transition-all duration-200 px-3 py-2 rounded-xl
                                    focus:outline-hidden focus:ring-2 focus:ring-orange-400 focus:ring-offset-2
                                    ${heading.level === 1 ?
                                        'font-bold text-base bg-orange-100/50 hover:bg-orange-100' :
                                        'hover:bg-orange-50'
                                    }
                                    ${heading.level === 2 ? 'pl-6 text-sm border-l-4 border-orange-200' : ''}
                                    ${heading.level === 3 ? 'pl-10 text-sm text-gray-600' : ''}
                                `}
                            >
                                {heading.level > 1 && (
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-orange-300 rounded-full" />
                                )}

                                <DynamicReactMarkdown components={{ p: React.Fragment }}>
                                    {heading.level === 3 ? `↳ ${heading.text}` : heading.text}
                                </DynamicReactMarkdown>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default BlogTableOfContents;