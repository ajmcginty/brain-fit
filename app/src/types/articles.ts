export interface Article {
  id: string;
  title: string;
  category: ArticleCategory;
  description: string;  // Short description
  url: string;          // External link to article
  imageUrl?: string;
  source?: string;      // e.g. "NIH", "Harvard Health"
}

export type ArticleCategory = 
  | 'exercise'
  | 'cognitive'
  | 'social'
  | 'sleep'
  | 'diet'
  | 'general';

export interface ArticleFilters {
  category?: ArticleCategory;
  searchQuery?: string;
}

export interface ArticleStore {
  articles: Article[];
  filters: ArticleFilters;
  loading: boolean;
  error: string | null;
  
  // Actions (read-only - articles are external links)
  setArticles: (articles: Article[]) => void;
  setFilters: (filters: ArticleFilters) => void;
  clearFilters: () => void;
}
