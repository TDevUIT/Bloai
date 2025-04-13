import React from 'react';
import AuthorCard from './BlogAuthorCard';
import { Author } from '@/types/helper.type';

interface BlogAuthorBioSectionProps {
    author: Author | null;
}

const BlogAuthorBioSection: React.FC<BlogAuthorBioSectionProps> = ({ author }) => {
    if (!author) return null;

    return (
        <div className='w-full flex items-center justify-center mb-12'>
            <AuthorCard author={author} imageSize={120} showSocials={true} />
        </div>
    );
};

export default BlogAuthorBioSection;