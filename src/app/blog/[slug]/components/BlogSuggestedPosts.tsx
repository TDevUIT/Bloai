import React from 'react';
import AuthorCard from './BlogAuthorCard';
import SuggestedBlogCard from './SuggestedBlogCard';
import { Author, SuggestedBlog } from '@/types/helper.type';
import { Card } from '@/components/ui/card';

interface BlogSuggestedPostsProps {
    author: Author | null;
    suggestedBlogs?: SuggestedBlog[] | null;
}

const BlogSuggestedPosts: React.FC<BlogSuggestedPostsProps> = ({ author, suggestedBlogs }) => {
    return (
        <aside className="md:block w-72 shrink-0 hidden self-start">
            <div className="sticky top-28 space-y-8">
                {author && (
                    <Card className='p-1 rounded-2xl relative bg-transparent'>
                        <div className="p-4  rounded-xl">
                            <AuthorCard author={author} imageSize={80} showSocials={false} />
                        </div>
                    </Card>
                )}
                {(suggestedBlogs && suggestedBlogs.length > 0) && (
                    <div className=' p-4 rounded-lg shadow-xs border'>
                        <h2 className="text-lg font-semibold mb-4 text-gray-800">Bài viết liên quan</h2>
                        <div className='overflow-y-auto max-h-[calc(100vh-200px)] space-y-5 scroll-custom pr-2 -mr-2'>
                            {suggestedBlogs.map((post) => (
                                <SuggestedBlogCard key={post.slug} post={post} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default BlogSuggestedPosts;