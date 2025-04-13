export const slugify = (text: string): string => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

export const getNodeText = (node: any): string => {
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(getNodeText).join('');
  if (typeof node === 'object' && node !== null && node.props?.children) {
    return getNodeText(node.props.children);
  }
  return '';
};

export interface AuthorSocials {
  twitter?: string;
  facebook?: string;
  linkedin?: string;
}

export interface Author {
  id?: string | number;
  name?: string;
  image?: string;
  bio?: string;
  socials?: AuthorSocials;
}

export interface BlogCore {
  slug: string;
  title: string;
  imageUrl?: string;
  imageAlt?: string;
  publishDate: string | Date;
  updatedAt?: string | Date;
  author: Author | null;
  metaDescription: string;
  canonicalUrl: string;
  tags: { name: string }[];
  readTime?: number;
}

export interface Blog extends BlogCore {
  content: string;
}

export interface SuggestedBlog {
  slug: string;
  title: string;
  imageUrl?: string;
  imageAlt?: string;
  publishDate: Date;
  readTime: number;
  metaDescription: string;
  author: {
    name?: string;
    image?: string;
  } | null;
  tags: { name: string }[];
}

export interface Heading {
  text: string;
  level: number;
  id: string;
}
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  metaDescription: string;
  content: string;
  imageUrl: string | null;
  imageAlt: string | null;
  authorId: string;
  publishDate: Date;
  updatedAt: Date;
  readTime: number;
  views: number;
  likes: number;
  keywords: string[];
  canonicalUrl: string | null;
  structuredData: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImageUrl: string | null;
  twitterCard: string | null;
  featured: boolean;
  tags: { id: string; name: string; description: string | null }[];
  author: {
    id: string;
    name: string;
    email: string;
    emailVerified: Date | null;
    image: string | null;
    bio: string | null;
  } | null;
}


export interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  createdAt: string;
}
