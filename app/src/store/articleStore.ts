import { create } from 'zustand';
import { Alert } from 'react-native';
import { Article, ArticleFilters, ArticleStore } from '../types/articles';
import { storage } from '../services/storage';
import { StorageError } from '../utils/errors';

const INITIAL_FILTERS: ArticleFilters = {
  category: undefined,
  searchQuery: undefined,
};

export const useArticleStore = create<ArticleStore>((set, get) => ({
  articles: [],
  filters: INITIAL_FILTERS,
  loading: false,
  error: null,

  setArticles: (articles) => {
    set({ articles });
  },

  addArticle: async (article) => {
    const previousArticles = get().articles;
    
    set((state) => ({
      articles: [...state.articles, article],
    }));

    try {
      const { articles } = get();
      await storage.saveArticles(articles);
    } catch (error) {
      // Revert state on error
      set({ articles: previousArticles });

      if (error instanceof StorageError) {
        Alert.alert(
          'Storage Error',
          StorageError.getReadableMessage(error),
          [{ text: 'OK' }]
        );
      }
      throw error;
    }
  },

  updateArticle: async (id, updates) => {
    const previousArticles = get().articles;
    const articleToUpdate = previousArticles.find(article => article.id === id);

    if (!articleToUpdate) {
      console.error('Attempted to update non-existent article:', id);
      return;
    }

    set((state) => ({
      articles: state.articles.map((article) =>
        article.id === id ? { ...article, ...updates } : article
      ),
    }));

    try {
      const { articles } = get();
      await storage.saveArticles(articles);
    } catch (error) {
      // Revert state on error
      set({ articles: previousArticles });

      if (error instanceof StorageError) {
        Alert.alert(
          'Storage Error',
          StorageError.getReadableMessage(error),
          [{ text: 'OK' }]
        );
      }
      throw error;
    }
  },

  deleteArticle: async (id) => {
    const previousArticles = get().articles;
    
    set((state) => ({
      articles: state.articles.filter(article => article.id !== id),
    }));

    try {
      const { articles } = get();
      await storage.saveArticles(articles);
    } catch (error) {
      // Revert state on error
      set({ articles: previousArticles });

      if (error instanceof StorageError) {
        Alert.alert(
          'Storage Error',
          StorageError.getReadableMessage(error),
          [{ text: 'OK' }]
        );
      }
      throw error;
    }
  },

  setFilters: (filters) => {
    set({ filters });
  },

  clearFilters: () => {
    set({ filters: INITIAL_FILTERS });
  },
}));

// Initialize store with data from storage
export const initializeArticleStore = async () => {
  try {
    const storedArticles = await storage.getArticles();

    if (storedArticles.length > 0) {
      useArticleStore.setState({ articles: storedArticles });
    }
  } catch (error) {
    console.error('Error initializing article store:', error);
    Alert.alert(
      'Data Loading Error',
      'Unable to load your saved articles. Starting with empty state.',
      [{ text: 'OK' }]
    );
  }
};
