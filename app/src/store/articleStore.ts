import { create } from 'zustand';
import { Alert } from 'react-native';
import { Article, ArticleFilters, ArticleStore } from '../types/articles';
import { storage } from '../services/storage';

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

  setFilters: (filters) => {
    set({ filters });
  },

  clearFilters: () => {
    set({ filters: INITIAL_FILTERS });
  },

  // Reset store (for logout)
  reset: () => {
    console.log('[articleStore] Resetting store');
    set({
      articles: [],
      filters: INITIAL_FILTERS,
      loading: false,
      error: null,
    });
  },
}));

// Initialize store with data from local storage (article links)
// Note: Articles are now simple external links, not synced to Firestore
export const initializeArticleStore = async () => {
  try {
    // Load articles from local storage
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
