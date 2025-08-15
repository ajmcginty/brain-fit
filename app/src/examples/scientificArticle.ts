import { addNewArticle } from '../utils/articleUtils';

// Example of adding a scientific article with full metadata
export const addExampleScientificArticle = async () => {
  await addNewArticle(
    'Physical Exercise and Cognitive Function in Aging Adults',
    'exercise',
    `Recent research has demonstrated a strong connection between regular physical exercise and cognitive function in older adults. This comprehensive review examines the latest evidence supporting the role of exercise in maintaining brain health.

Key Findings:
1. Regular aerobic exercise is associated with improved memory and executive function
2. Resistance training shows benefits for cognitive processing speed
3. Combined exercise programs demonstrate the most significant cognitive benefits
4. Exercise frequency and intensity play crucial roles in outcomes

Clinical Implications:
The findings suggest that implementing structured exercise programs could be an effective intervention for maintaining cognitive health in aging populations. Healthcare providers should consider exercise recommendations as part of cognitive health management strategies.`,
    {
      authors: [
        'Smith, J.A.',
        'Johnson, M.B.',
        'Williams, R.C.'
      ],
      journal: 'Journal of Aging and Physical Activity',
      publicationYear: 2023,
      doi: '10.1000/example-doi',
      sourceUrl: 'https://example.com/article',
      citation: 'Smith, J.A., Johnson, M.B., & Williams, R.C. (2023). Physical Exercise and Cognitive Function in Aging Adults. Journal of Aging and Physical Activity, 35(2), 145-167.',
      summary: 'A comprehensive review of recent evidence linking physical exercise to improved cognitive function in older adults, with specific recommendations for exercise programs.',
      institution: 'University of Health Sciences'
    }
  );
};

// Example of adding a scientific article with minimal metadata
export const addSimpleScientificArticle = async () => {
  await addNewArticle(
    'Sleep Quality and Brain Health: New Findings',
    'sleep',
    `A recent study has revealed important connections between sleep quality and cognitive health...`,
    {
      authors: ['Brown, A.', 'Lee, S.'],
      journal: 'Sleep Research Quarterly',
      publicationYear: 2023,
      sourceUrl: 'https://example.com/sleep-study'
    }
  );
};
