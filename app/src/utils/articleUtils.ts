import { Article, ArticleCategory } from '../types/articles';
import { useArticleStore } from '../store/articleStore';

export const createArticle = (
  title: string,
  category: ArticleCategory,
  content: string,
  options: Partial<Article> = {}
): Article => {
  return {
    id: `article_${Date.now()}`,
    title,
    category,
    content,
    readTime: estimateReadTime(content),
    publishedDate: new Date().toISOString(),
    ...options,
  };
};

export const estimateReadTime = (content: string): string => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min`;
};

export const addNewArticle = async (
  title: string,
  category: ArticleCategory,
  content: string,
  options: Partial<Article> = {}
): Promise<void> => {
  const article = createArticle(title, category, content, options);
  await useArticleStore.getState().addArticle(article);
};

// Example usage:
/*
await addNewArticle(
  'New Exercise Tips',
  'exercise',
  'Article content here...',
  {
    summary: 'Optional summary',
    imageUrl: 'optional-image-url'
  }
);
*/
