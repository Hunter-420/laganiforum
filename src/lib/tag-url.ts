export function blogTagUrl(locale: string, tag: string): string {
  return `/${locale}/blog?tag=${encodeURIComponent(tag.trim())}`;
}

export function blogCategoryUrl(locale: string, category: string): string {
  return `/${locale}/blog?category=${encodeURIComponent(category)}`;
}
