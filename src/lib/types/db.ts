import { ObjectId } from "mongodb";

export interface AffiliateBlock {
  title: string;
  description: string;
  image?: string;
  ctaText: string;
  url: string;
}

export interface PostDocument {
  _id?: ObjectId;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  language: "en" | "np";
  category: string;
  tags: string[];
  coverImage: string;
  coverImageAlt: string;
  status: "draft" | "published";
  author: string;
  wordCount: number;
  createdAt: Date;
  updatedAt: Date;

  isFeatured?: boolean;
  draftKind?: "standard" | "translation";
  views?: number;
  affiliate?: AffiliateBlock;
  disclaimer?: string;
  translationGroupId?: string;
}

export interface MediaDocument {
  _id?: ObjectId;
  url: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  uploadedAt: Date;
}

export interface AnalyticsDocument {
  _id?: ObjectId;
  path: string;
  ipHash: string; // Hashed to protect privacy
  userAgent: string;
  timestamp: Date;
}
