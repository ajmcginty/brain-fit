import { Article } from '../types/articles';

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'exercise_nia',
    title: 'Exercise and Physical Activity',
    category: 'exercise',
    description: 'Learn about the four main types of exercise and how they can help maintain and improve your health as you age.',
    url: 'https://www.nia.nih.gov/health/exercise-physical-activity',
    source: 'National Institute on Aging',
  },
  {
    id: 'sleep_cdc',
    title: 'Sleep and Brain Health',
    category: 'sleep',
    description: 'Discover how quality sleep impacts brain health and learn practical tips for better sleep habits.',
    url: 'https://www.cdc.gov/sleep/about_sleep/index.html',
    source: 'CDC',
  },
  {
    id: 'cognitive_ncbi',
    title: 'Cognitive Training in Older Adults',
    category: 'cognitive',
    description: 'Research on cognitive training methods and their effectiveness in maintaining brain health.',
    url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3386797/',
    source: 'NIH',
  },
  {
    id: 'nutrition_harvard',
    title: 'The MIND Diet and Brain Health',
    category: 'diet',
    description: 'Explore the MIND diet and its potential benefits for brain health and cognitive function.',
    url: 'https://www.health.harvard.edu/blog/mind-diet-may-protect-against-alzheimers-201502148735',
    source: 'Harvard Health',
  },
  {
    id: 'social_nia',
    title: 'Social Connections and Cognitive Health',
    category: 'social',
    description: 'Understanding the vital link between social connections and cognitive health in older adults.',
    url: 'https://www.nia.nih.gov/health/cognitive-health/social-activities',
    source: 'National Institute on Aging',
  },
];

