import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "content");

export interface PostMeta {
  title: string;
  excerpt: string;
  date: string;
  updatedAt?: string;
  category: string;
  author: string;
  tags?: string[];
  slug: string;
  locale: string;
  isFeatured?: boolean;
  createdAt?: string;
  image?: string;
  coverImageAlt?: string;
  readingTime?: string;
  affiliate?: import('./types/db').AffiliateBlock;
  views?: number;
  _id?: string;
}

export interface Post {
  meta: PostMeta;
  content: string;
}

export function getPostSlugs(locale: string) {
  const dirPath = path.join(contentDirectory, locale);
  if (!fs.existsSync(dirPath)) return [];
  return fs.readdirSync(dirPath).filter((fileName) => fileName.endsWith(".mdx") || fileName.endsWith(".md"));
}

export function getPostBySlug(slug: string, locale: string = "en"): Post | null {
  const realSlug = slug.replace(/\.mdx?$/, "");
  const fullPathMdx = path.join(contentDirectory, locale, `${realSlug}.mdx`);
  const fullPathMd = path.join(contentDirectory, locale, `${realSlug}.md`);
  
  let fileContents = "";
  if (fs.existsSync(fullPathMdx)) {
    fileContents = fs.readFileSync(fullPathMdx, "utf8");
  } else if (fs.existsSync(fullPathMd)) {
    fileContents = fs.readFileSync(fullPathMd, "utf8");
  } else {
    return null;
  }

  const { data, content } = matter(fileContents);

  const date = (data.date as string) || new Date().toISOString().split("T")[0];
  const updatedAt =
    (data.updatedAt as string) || (data.date as string) || date;

  return {
    meta: {
      ...data,
      date,
      updatedAt,
      slug: realSlug,
      locale,
    } as PostMeta,
    content,
  };
}

export function getAllPosts(locale: string = "en"): Post[] {
  const slugs = getPostSlugs(locale);
  const posts = slugs
    .map((slug) => getPostBySlug(slug, locale))
    .filter((post): post is Post => post !== null)
    .sort((post1, post2) => (post1.meta.date > post2.meta.date ? -1 : 1));
  return posts;
}
