const natural = require('natural');
const nlp = require('compromise');

// Knowledge base of common solutions (you can expand this)
const knowledgeBase = [
  {
    keywords: ['login', 'password', 'authentication', 'sign in'],
    category: 'Authentication',
    priority: 'high',
    solutions: [
      'Reset your password using the "Forgot Password" link',
      'Clear your browser cache and cookies',
      'Check if Caps Lock is enabled',
      'Try logging in with a different browser'
    ]
  },
  {
    keywords: ['slow', 'loading', 'performance', 'lag'],
    category: 'Performance',
    priority: 'medium',
    solutions: [
      'Clear your browser cache',
      'Check your internet connection',
      'Try refreshing the page',
      'Disable browser extensions temporarily'
    ]
  },
  {
    keywords: ['error', 'bug', 'broken', 'not working'],
    category: 'Bug Report',
    priority: 'high',
    solutions: [
      'Try refreshing the page',
      'Clear browser cache and cookies',
      'Check if you have the latest browser version',
      'Try using a different browser or device'
    ]
  },
  {
    keywords: ['feature', 'request', 'suggestion', 'improvement'],
    category: 'Feature Request',
    priority: 'low',
    solutions: [
      'Thank you for your suggestion! We will review it with our development team',
      'Check our roadmap for similar planned features',
      'Consider if this could be solved with existing functionality'
    ]
  }
];

class AIService {
  // Categorize ticket based on content
  static async categorizeTicket(description, subject = '') {
    const text = `${subject} ${description}`.toLowerCase();
    const doc = nlp(text);
    
    // Extract keywords using NLP
    const keywords = doc.words().out('array');
    
    let bestMatch = { category: 'General', confidence: 0 };
    
    knowledgeBase.forEach(item => {
      const matches = item.keywords.filter(keyword => 
        text.includes(keyword) || keywords.some(k => k.includes(keyword))
      );
      
      const confidence = matches.length / item.keywords.length;
      if (confidence > bestMatch.confidence) {
        bestMatch = {
          category: item.category,
          confidence,
          keywords: matches
        };
      }
    });
    
    return bestMatch;
  }

  // Determine priority based on content analysis
  static async calculatePriority(description, subject = '', category = 'General') {
    const text = `${subject} ${description}`.toLowerCase();
    
    // High priority indicators
    const highPriorityWords = [
      'urgent', 'critical', 'emergency', 'down', 'broken', 
      'error', 'crash', 'cannot', 'unable', 'failed'
    ];
    
    // Medium priority indicators
    const mediumPriorityWords = [
      'issue', 'problem', 'slow', 'not working', 'bug',
      'question', 'help', 'support'
    ];
    
    let score = 0;
    
    // Check for high priority words
    highPriorityWords.forEach(word => {
      if (text.includes(word)) score += 3;
    });
    
    // Check for medium priority words
    mediumPriorityWords.forEach(word => {
      if (text.includes(word)) score += 1;
    });
    
    // Category-based priority adjustment
    const categoryPriority = {
      'Authentication': 3,
      'Bug Report': 3,
      'Performance': 2,
      'Feature Request': 1,
      'General': 2
    };
    
    score += categoryPriority[category] || 2;
    
    // Determine priority level
    if (score >= 6) return { priority: 'high', score };
    if (score >= 3) return { priority: 'medium', score };
    return { priority: 'low', score };
  }

  // Get smart bot solution recommendations (knowledge base only)
  static async getSolutionRecommendations(description, subject = '', category = 'General') {
    try {
      const categorization = await this.categorizeTicket(description, subject);
      const priority = await this.calculatePriority(description, subject, categorization.category);
      
      // Find matching knowledge base entries
      const matchingSolutions = knowledgeBase.filter(item => 
        item.category === categorization.category
      );
      
      let recommendations = [];
      
      if (matchingSolutions.length > 0) {
        recommendations = matchingSolutions[0].solutions;
      } else {
        // Fallback recommendations
        recommendations = [
          'Please provide more details about your issue',
          'Try refreshing the page or clearing your browser cache',
          'Contact support if the issue persists'
        ];
      }
      
      return {
        recommendations: recommendations.slice(0, 5), // Limit to 5 recommendations
        category: categorization.category,
        confidence: categorization.confidence,
        priority: priority.priority,
        priorityScore: priority.score
      };
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return {
        recommendations: ['Please contact support for assistance'],
        category: 'General',
        confidence: 0,
        priority: 'medium',
        priorityScore: 2
      };
    }
  }


  // Find similar tickets
  static async findSimilarTickets(ticketDescription, existingTickets = []) {
    if (existingTickets.length === 0) return [];
    
    const ticketText = ticketDescription.toLowerCase();
    const similarities = [];
    
    existingTickets.forEach(ticket => {
      const existingText = `${ticket.subject} ${ticket.description}`.toLowerCase();
      
      // Simple similarity calculation using Jaccard similarity
      const ticketWords = new Set(ticketText.split(/\s+/));
      const existingWords = new Set(existingText.split(/\s+/));
      
      const intersection = new Set([...ticketWords].filter(x => existingWords.has(x)));
      const union = new Set([...ticketWords, ...existingWords]);
      
      const similarity = intersection.size / union.size;
      
      if (similarity > 0.1) { // Only include tickets with >10% similarity
        similarities.push({
          ticket,
          similarity,
          matchingWords: [...intersection]
        });
      }
    });
    
    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3); // Return top 3 similar tickets
  }
}

module.exports = AIService;
