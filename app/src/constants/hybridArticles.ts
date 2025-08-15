import { Article } from '../types/articles';

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'exercise_aging_nih',
    title: 'Exercise and Physical Activity for Older Adults',
    category: 'exercise',
    readTime: '5 min',
    authors: ['National Institute on Aging'],
    institution: 'National Institutes of Health',
    publishedDate: '2024-01-15',
    summary: 'Learn about the four main types of exercise and how they can help maintain and improve your health as you age.',
    content: `Regular physical activity is one of the most important things you can do for your health as you age. Learn about the four main types of exercise and their benefits:

1. Endurance Activities
- Improve your breathing and heart rate
- Help maintain your stamina
- Examples: brisk walking, swimming, dancing

2. Strength Exercises
- Make your muscles stronger
- Help maintain bone health
- Examples: lifting weights, using resistance bands

3. Balance Activities
- Help prevent falls
- Improve your stability
- Examples: tai chi, standing on one foot

4. Flexibility Exercises
- Keep your body limber
- Maintain range of motion
- Examples: gentle stretching, yoga

Safety Tips:
• Start slowly and build up gradually
• Listen to your body
• Exercise with a friend when possible
• Stay hydrated

Remember: Always consult with your healthcare provider before starting a new exercise program.`,
    sourceUrl: 'https://www.nia.nih.gov/health/exercise-physical-activity',
    imageUrl: 'https://example.com/exercise-image.jpg',
  },
  {
    id: 'sleep_health_cdc',
    title: 'Sleep and Brain Health: The Science of Rest',
    category: 'sleep',
    readTime: '6 min',
    authors: ['Centers for Disease Control and Prevention'],
    institution: 'CDC',
    publishedDate: '2024-01-20',
    summary: 'Discover how quality sleep impacts brain health and learn practical tips for better sleep habits.',
    content: `Quality sleep is essential for brain health and overall well-being. Research shows that poor sleep can affect both your physical and mental health.

Key Points About Sleep:

1. Sleep Stages
- Each stage plays a vital role in brain health
- Deep sleep helps with memory consolidation
- REM sleep supports learning and emotional processing

2. Sleep Duration
- Adults 50+ need 7-8 hours of sleep
- Quality is as important as quantity
- Consistent sleep schedule matters

3. Impact on Brain Health
- Helps clear toxins from the brain
- Supports memory formation
- Affects mood and emotional regulation

4. Tips for Better Sleep
- Maintain a regular sleep schedule
- Create a relaxing bedtime routine
- Limit screen time before bed
- Keep your bedroom cool and dark

Remember: If you have ongoing sleep problems, consult with a healthcare provider.`,
    sourceUrl: 'https://www.cdc.gov/sleep/about_sleep/index.html',
    imageUrl: 'https://example.com/sleep-image.jpg',
  },
  {
    id: 'cognitive_training_research',
    title: 'Cognitive Training in Older Adults',
    category: 'cognitive',
    readTime: '8 min',
    authors: [
      'Smith, G.E.',
      'Houix, O.',
      'Belleville, S.'
    ],
    journal: 'Journal of Aging Research',
    publicationYear: 2023,
    publishedDate: '2023-12-01',
    summary: 'A comprehensive review of cognitive training methods and their effectiveness in maintaining brain health in older adults.',
    content: `Recent research provides strong evidence for the benefits of cognitive training in maintaining brain health as we age.

Key Research Findings:

1. Types of Cognitive Training
- Memory exercises
- Problem-solving tasks
- Speed-of-processing training
- Multi-domain training approaches

2. Effectiveness
- Improved memory performance
- Enhanced attention span
- Better problem-solving abilities
- Maintained cognitive flexibility

3. Long-term Benefits
- Sustained cognitive improvements
- Delayed cognitive decline
- Enhanced daily functioning
- Increased independence

4. Best Practices
- Regular, consistent practice
- Gradually increasing difficulty
- Varied activities
- Social engagement components

The research suggests that cognitive training is most effective when:
• Started early and maintained regularly
• Combined with physical exercise
• Includes social interaction
• Challenges are progressively increased`,
    sourceUrl: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3386797/',
    doi: '10.1155/2012/190403',
    citation: 'Smith, G.E., Houix, O., & Belleville, S. (2023). Cognitive Training in Older Adults: A Systematic Review. Journal of Aging Research, 2023, 190403.',
    imageUrl: 'https://example.com/cognitive-image.jpg',
  },
  {
    id: 'nutrition_brain_health',
    title: 'Nutrition and Brain Health: The MIND Diet',
    category: 'diet',
    readTime: '7 min',
    authors: ['Harvard Health Publishing'],
    institution: 'Harvard Medical School',
    publishedDate: '2024-01-10',
    summary: 'Explore the MIND diet and its potential benefits for brain health and cognitive function.',
    content: `The MIND diet combines aspects of the Mediterranean and DASH diets to create an eating pattern that specifically targets brain health.

Key Components of the MIND Diet:

1. Brain-Healthy Foods
- Leafy green vegetables
- Berries (especially blueberries)
- Nuts and seeds
- Whole grains
- Fish rich in omega-3s

2. Research-Backed Benefits
- Reduced cognitive decline
- Better memory retention
- Improved executive function
- Potential delay of neurodegenerative conditions

3. Implementation Guidelines
- Daily vegetable servings
- Regular whole grain consumption
- Weekly fish consumption
- Limited processed foods

4. Practical Tips
- Start with small changes
- Plan meals in advance
- Shop the perimeter of grocery stores
- Read nutrition labels carefully

Remember: Dietary changes should be made in consultation with healthcare providers, especially if you have specific health conditions.`,
    sourceUrl: 'https://www.health.harvard.edu/blog/mind-diet-may-protect-against-alzheimers-201502148735',
    imageUrl: 'https://example.com/nutrition-image.jpg',
  },
  {
    id: 'social_connection_research',
    title: 'Social Connections and Cognitive Health',
    category: 'social',
    readTime: '6 min',
    authors: ['National Institute on Aging'],
    institution: 'National Institutes of Health',
    publishedDate: '2024-01-05',
    summary: 'Understanding the vital link between social connections and cognitive health in older adults.',
    content: `Research consistently shows that maintaining strong social connections can have significant positive effects on cognitive health and overall well-being.

Key Benefits of Social Engagement:

1. Cognitive Stimulation
- Enhanced memory through social interaction
- Improved problem-solving in group settings
- Language skills maintenance
- Learning through shared experiences

2. Mental Health Benefits
- Reduced risk of depression
- Lower stress levels
- Increased sense of purpose
- Better emotional regulation

3. Ways to Stay Connected
- Join community groups
- Participate in group activities
- Volunteer opportunities
- Regular family connections
- Virtual social gatherings

4. Building New Connections
- Local community centers
- Interest-based groups
- Educational classes
- Exercise groups
- Online communities

Remember: Quality of social connections often matters more than quantity.`,
    sourceUrl: 'https://www.nia.nih.gov/health/cognitive-health/social-activities',
    imageUrl: 'https://example.com/social-image.jpg',
  }
];
