export interface Article {
  id: string;
  title: string;
  category: ArticleCategory;
  readTime: string;
  content: string;
  summary?: string;
  imageUrl?: string;
  publishedDate: string;
  lastUpdated?: string;
  // Scientific article metadata
  sourceUrl?: string;
  doi?: string;
  authors?: string[];
  journal?: string;
  publicationYear?: number;
  citation?: string;
  institution?: string;
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
  
  // Actions
  setArticles: (articles: Article[]) => void;
  addArticle: (article: Article) => void;
  updateArticle: (id: string, updates: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  setFilters: (filters: ArticleFilters) => void;
  clearFilters: () => void;
}
