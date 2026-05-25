export interface TopicCluster {
  slug: string;
  titleEn: string;
  titleNp: string;
  descriptionEn: string;
  descriptionNp: string;
  categories?: string[];
  tags?: string[];
}

export const TOPIC_CLUSTERS: TopicCluster[] = [
  {
    slug: "nepse",
    titleEn: "NEPSE",
    titleNp: "नेप्से",
    descriptionEn: "Nepal Stock Exchange analysis, updates, and education.",
    descriptionNp: "नेपाल स्टक एक्सचेन्ज विश्लेषण, अपडेट, र शिक्षा।",
    categories: ["NEPSE", "NEPSE Update"],
    tags: ["NEPSE", "Nepal Market Focus"],
  },
  {
    slug: "ipo",
    titleEn: "IPO",
    titleNp: "आईपीओ",
    descriptionEn: "IPO news, allotment, and listing analysis for Nepal.",
    descriptionNp: "नेपालका आईपीओ समाचार, बाँडफाँड, र विश्लेषण।",
    tags: ["IPO"],
  },
  {
    slug: "forex",
    titleEn: "Forex",
    titleNp: "फरेक्स",
    descriptionEn: "Foreign exchange education and market context.",
    descriptionNp: "विदेशी मुद्रा शिक्षा र बजार सम्बन्धी सामग्री।",
    categories: ["Forex"],
    tags: ["Forex"],
  },
  {
    slug: "technical-analysis",
    titleEn: "Technical Analysis",
    titleNp: "प्राविधिक विश्लेषण",
    descriptionEn: "Chart patterns, indicators, and trade setup education.",
    descriptionNp: "चार्ट, सूचक, र व्यापार सेटअप शिक्षा।",
    categories: ["Technical Analysis"],
    tags: ["Technical Analysis", "Swing Trading"],
  },
  {
    slug: "personal-finance",
    titleEn: "Personal Finance",
    titleNp: "व्यक्तिगत वित्त",
    descriptionEn: "Budgeting, saving, and financial literacy for Nepal.",
    descriptionNp: "बचत, लगानी साक्षरता, र व्यक्तिगत वित्त शिक्षा।",
    categories: ["Personal Finance"],
    tags: ["Risk Management"],
  },
];

export function getTopicBySlug(slug: string): TopicCluster | undefined {
  return TOPIC_CLUSTERS.find((t) => t.slug === slug);
}
