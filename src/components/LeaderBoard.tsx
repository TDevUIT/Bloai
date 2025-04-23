import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Eye, Medal, Trophy, Star, Zap } from 'lucide-react';
import { api } from '@/trpc/server';
import Image from 'next/image';
import { FaUser } from 'react-icons/fa';
import Link from 'next/link';

interface Author {
    id: string;
    name: string;
    blogCount: number;
    avatar: string | null; 
}

interface Blog {
    id: string;
    title: string;
    views: number;
    author: string; 
    slug: string;
}

export const dynamic = 'force-dynamic';

const LeaderBoard = async () => {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('vi-VN', { month: 'long' });
    const currentYear = currentDate.getFullYear();
    
    let topAuthorsThisMonth: Author[] = [];
    let topViewedBlogs: Blog[] = [];

    try {
        const leaderboardData = await api.blog.getLeaderBoard({}); 
        topAuthorsThisMonth = leaderboardData.topAuthors;
        topViewedBlogs = leaderboardData.topViewedBlogs;
    } catch (error) {
        console.error('Error fetching leaderboard data:', error);
    }

    const getMedalIcon = (index: number) => {
        switch (index) {
          case 0: return <Medal className="w-5 h-5 sm:w-6 sm:h-6 fill-yellow-400 stroke-yellow-500" />;
          case 1: return <Medal className="w-5 h-5 sm:w-6 sm:h-6 fill-slate-300 stroke-slate-400" />;
          case 2: return <Medal className="w-5 h-5 sm:w-6 sm:h-6 fill-amber-500 stroke-amber-600" />;
          default: return <span className="font-medium text-slate-500 text-sm sm:text-base">{index + 1}</span>;
        }
    };
    
    const getBlogRankIcon = (index: number) => {
        switch (index) {
            case 0: return <Trophy className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 stroke-yellow-500" />;
            case 1: return <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-blue-400 stroke-blue-500" />;
            case 2: return <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-purple-400 stroke-purple-500" />;
            default: return <span className="text-xs sm:text-sm font-medium text-slate-500">{index + 1}</span>;
        }
    };

    return (
        <Card className="w-full border border-slate-200 shadow-sm rounded-lg sm:rounded-xl overflow-hidden">
          <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-100 p-4 sm:p-6">
            <CardTitle className="text-xl sm:text-2xl flex items-center gap-3 text-slate-800">
              <span>Bảng xếp hạng</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="bg-slate-50 p-3 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <Card className="relative overflow-hidden border border-slate-200 bg-white shadow-sm">
                <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-400 to-amber-500 text-white px-2 py-0.5 sm:px-3 sm:py-1 text-xs font-semibold rounded-bl-lg shadow-sm">
                  {currentMonth} {currentYear}
                </div>
                <CardHeader className="pb-3 sm:pb-4 border-b border-slate-100 p-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-slate-800">
                      <span>Tác giả hàng đầu</span>
                    </CardTitle>
                    <span className="text-xs sm:text-sm text-slate-500 font-medium mt-2">Số bài viết</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-2 sm:space-y-3 pt-2 sm:pt-4 p-3 sm:p-4">
                  {topAuthorsThisMonth.map((author, index) => (
                    <div 
                      key={author.id} 
                      className={`flex items-center p-2 sm:p-3 rounded-lg transition-all hover:shadow-md ${
                        index < 3 ? 'bg-gradient-to-r from-amber-50/50 to-white border border-amber-100' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="mr-2 sm:mr-3 flex-shrink-0">
                        {getMedalIcon(index)}
                      </div>
                      
                      <div className="flex items-center flex-1 min-w-0 gap-x-2 sm:gap-x-3">
                        {author.avatar ? (
                          <Image
                            src={author.avatar}
                            alt={`${author.avatar}'s avatar`}
                            width={40}
                            height={40}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                            priority
                          />
                        ) : (
                          <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-slate-100 rounded-full border-2 border-white shadow-sm flex-shrink-0">
                            <FaUser className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500" />
                          </div>
                        )}
                        <span className="font-medium text-sm sm:text-base text-slate-800 truncate">{author.name}</span>
                      </div>
                      
                      <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-semibold ${
                        index < 3 
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {author.blogCount} bài
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
    
              <Card className="border border-slate-200 bg-white shadow-sm">
                <CardHeader className="border-b border-slate-100 p-4">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-slate-800">
                    <div className="p-1 sm:p-1.5 bg-purple-100 rounded-lg">
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4 fill-purple-400 stroke-purple-600" />
                    </div>
                    <span>Bài viết nổi bật</span>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-2 sm:space-y-3 pt-2 sm:pt-4 p-3 sm:p-4">
                  {topViewedBlogs.map((blog, index) => (
                    <div 
                      key={blog.id} 
                      className={`group p-2 sm:p-3 rounded-lg transition-all hover:shadow-md ${
                        index < 3 ? 'border border-purple-100 bg-gradient-to-r from-purple-50/50 to-white' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className={`mr-2 sm:mr-3 mt-0.5 sm:mt-1 flex-shrink-0 ${
                          index < 3 ? 'text-purple-500' : 'text-slate-400'
                        }`}>
                          {getBlogRankIcon(index)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm sm:text-base text-slate-800 hover:text-purple-600 line-clamp-2 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <Link href={`/blog/${blog.slug}`} className="truncate">{blog.title}</Link>
                            {index < 3 && (
                              <span className={`text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full flex-shrink-0 ${
                                index === 0 
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : index === 1
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-purple-100 text-purple-800'
                              }`}>
                                {index === 0 ? 'HOT' : index === 1 ? 'POPULAR' : 'TRENDING'}
                              </span>
                            )}
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">bởi {blog.author}</p>
                        </div>
                        
                        <div className="flex items-center ml-2 text-xs sm:text-sm font-semibold group-hover:text-purple-600 transition-colors flex-shrink-0">
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-0.5 sm:mr-1" />
                          {blog.views.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
    );
};

export default LeaderBoard;