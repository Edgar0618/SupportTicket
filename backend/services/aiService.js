const OpenAI = require('openai');
const natural = require('natural');
const nlp = require('compromise');

// Initialize OpenAI (you'll need to add OPENAI_API_KEY to your .env file)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

  // Get AI-powered solution recommendations
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
      }
      
      // Use OpenAI for more sophisticated recommendations if API key is available
      if (process.env.OPENAI_API_KEY) {
        try {
          const aiRecommendations = await this.getAIRecommendations(description, subject, category);
          recommendations = [...recommendations, ...aiRecommendations];
        } catch (error) {
          console.log('OpenAI API error, using fallback recommendations:', error.message);
        }
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

  // Use OpenAI for advanced recommendations
  static async getAIRecommendations(description, subject = '', category = 'General') {
    const prompt = `
    As a support desk AI assistant, analyze this support ticket and provide 3 helpful solution recommendations.
    
    Ticket Subject: ${subject}
    Ticket Description: ${description}
    Category: ${category}
    
    Provide practical, actionable solutions that a user can try. Be concise and helpful.
    Format each recommendation as a clear, numbered step.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful support desk assistant. Provide practical, actionable solutions for user issues."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const aiResponse = response.choices[0].message.content;
    
    // Parse AI response into individual recommendations
    const recommendations = aiResponse
      .split('\n')
      .filter(line => line.trim() && (line.includes('.') || line.includes(':')))
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .slice(0, 3);
    
    return recommendations;
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
