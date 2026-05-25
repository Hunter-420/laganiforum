export interface StockEntity {
  slug: string;
  nameEn: string;
  nameNp: string;
  symbol: string;
  sectorEn: string;
  sectorNp: string;
  tags: string[];
  keywords: string[];
}

export const STOCK_ENTITIES: StockEntity[] = [
  {
    slug: "nabil-bank",
    nameEn: "Nabil Bank",
    nameNp: "नबिल बैंक",
    symbol: "NABIL",
    sectorEn: "Banking",
    sectorNp: "बैंकिङ",
    tags: ["NABIL", "Banking", "NEPSE"],
    keywords: ["nabil", "nabil bank"],
  },
  {
    slug: "ntc",
    nameEn: "Nepal Telecom",
    nameNp: "नेपाल टेलिकम",
    symbol: "NTC",
    sectorEn: "Telecom",
    sectorNp: "टेलिकम",
    tags: ["NTC", "NEPSE"],
    keywords: ["ntc", "nepal telecom"],
  },
  {
    slug: "hidcl",
    nameEn: "HIDCL",
    nameNp: "हाइड्रोइलेक्ट्रिसिटी इन्भेष्टमेन्ट",
    symbol: "HIDCL",
    sectorEn: "Hydropower",
    sectorNp: "जलविद्युत",
    tags: ["HIDCL", "Hydropower", "NEPSE"],
    keywords: ["hidcl", "hydropower"],
  },
  {
    slug: "upper-tamakoshi",
    nameEn: "Upper Tamakoshi Hydropower",
    nameNp: "माथिल्लो तामाकोशी जलविद्युत",
    symbol: "UPPER",
    sectorEn: "Hydropower",
    sectorNp: "जलविद्युत",
    tags: ["Hydropower", "NEPSE", "IPO"],
    keywords: ["upper tamakoshi", "upper"],
  },
];

export function getStockBySlug(slug: string): StockEntity | undefined {
  return STOCK_ENTITIES.find((s) => s.slug === slug);
}
