import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for demo purposes
});

export class WizardSearchService {
  constructor() {
    this.searchCache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
  }

  async searchWizards(query, wizards, options = {}) {
    const cacheKey = `${query}_${JSON.stringify(options)}`;
    
    // Check cache first
    if (this.searchCache.has(cacheKey)) {
      const cached = this.searchCache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheExpiry) {
        return cached.results;
      }
    }

    try {
      const searchResults = await this.performIntelligentSearch(query, wizards, options);
      
      // Cache results
      this.searchCache.set(cacheKey, {
        results: searchResults,
        timestamp: Date.now()
      });

      return searchResults;
    } catch (error) {
      console.error('OpenAI search error:', error);
      // Fallback to basic search
      return this.fallbackSearch(query, wizards);
    }
  }

  async performIntelligentSearch(query, wizards, options = {}) {
    const systemPrompt = `You are an expert wizard matching system. Your job is to analyze user queries and match them with the most relevant wizards based on their expertise, archetype, and availability.

Available Archetypes:
- Coach: Performance-focused guidance, goal achievement, accountability
- Mentor: Experience sharing, career guidance, wisdom transfer  
- Counselor: Emotional support, personal challenges, healing
- Consultant: Problem-solving, strategic advice, expertise

Analyze the user's query and return a JSON array of wizard IDs ranked by relevance (1-10 scale), with explanations.

Format:
{
  "matches": [
    {
      "wizardId": "wizard_id", 
      "relevanceScore": 8.5,
      "reasoning": "Why this wizard matches",
      "matchedKeywords": ["keyword1", "keyword2"],
      "archetypeMatch": "coach"
    }
  ],
  "searchIntent": "What the user is looking for",
  "suggestedFilters": ["filter1", "filter2"]
}`;

    const userPrompt = `User Query: "${query}"

Available Wizards:
${wizards.map(wizard => `
ID: ${wizard.id}
Name: ${wizard.name}
Archetype: ${wizard.archetype}
Specialties: ${wizard.specialties?.join(', ') || 'General'}
Bio: ${wizard.bio}
Location: ${wizard.location}
Availability: ${wizard.availability}
Rating: ${wizard.rating}
Hourly Rate: $${wizard.hourlyRate}
`).join('\n')}

Additional Context:
- Prioritize availability if user mentions urgency
- Consider location for in-person preferences
- Match personality style to archetype
- Factor in budget if mentioned
- Consider experience level needed

Return only the JSON response.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const response = completion.choices[0].message.content.trim();
    const parsedResponse = JSON.parse(response);

    // Sort wizards by relevance score
    const sortedMatches = parsedResponse.matches.sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    // Map back to wizard objects with metadata
    const rankedWizards = sortedMatches.map(match => {
      const wizard = wizards.find(w => w.id.toString() === match.wizardId.toString());
      return {
        ...wizard,
        searchMetadata: {
          relevanceScore: match.relevanceScore,
          reasoning: match.reasoning,
          matchedKeywords: match.matchedKeywords,
          archetypeMatch: match.archetypeMatch
        }
      };
    }).filter(Boolean);

    return {
      wizards: rankedWizards,
      searchIntent: parsedResponse.searchIntent,
      suggestedFilters: parsedResponse.suggestedFilters,
      totalResults: rankedWizards.length
    };
  }

  fallbackSearch(query, wizards) {
    const queryLower = query.toLowerCase();
    const searchTerms = queryLower.split(' ').filter(term => term.length > 2);
    
    const scored = wizards.map(wizard => {
      let score = 0;
      const searchableText = `${wizard.name} ${wizard.bio} ${wizard.specialties?.join(' ')} ${wizard.archetype}`.toLowerCase();
      
      searchTerms.forEach(term => {
        if (searchableText.includes(term)) {
          score += 1;
        }
      });

      // Boost score for exact archetype match
      if (queryLower.includes(wizard.archetype)) {
        score += 2;
      }

      return {
        ...wizard,
        searchMetadata: {
          relevanceScore: score,
          reasoning: `Matched ${score} search terms`,
          matchedKeywords: searchTerms.filter(term => searchableText.includes(term)),
          archetypeMatch: wizard.archetype
        }
      };
    }).filter(wizard => wizard.searchMetadata.relevanceScore > 0);

    return {
      wizards: scored.sort((a, b) => b.searchMetadata.relevanceScore - a.searchMetadata.relevanceScore),
      searchIntent: `Looking for: ${query}`,
      suggestedFilters: [],
      totalResults: scored.length
    };
  }

  async generateSearchSuggestions(query) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Generate 3-5 related search suggestions for wizard/coach matching based on the user's query. Focus on different aspects like archetype, specialty, or specific needs. Return as JSON array of strings.`
          },
          {
            role: "user",
            content: `User searched for: "${query}"`
          }
        ],
        temperature: 0.5,
        max_tokens: 200,
      });

      const suggestions = JSON.parse(completion.choices[0].message.content);
      return suggestions;
    } catch (error) {
      console.error('Error generating suggestions:', error);
      return [];
    }
  }
}

export const wizardSearchService = new WizardSearchService();