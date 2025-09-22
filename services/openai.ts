import { OpenAIResponse } from '../types';

class OpenAIService {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1';

  constructor() {
    this.apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY || '';
    if (!this.apiKey) {
      console.warn('OpenAI API key not configured');
    }
  }

  // Generate reflection prompt based on sleep score
  async generateReflectionPrompt(score: number): Promise<OpenAIResponse> {
    try {
      const promptType = this.getPromptType(score);
      const systemPrompt = this.getSystemPrompt(promptType);
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: `Generate a thoughtful reflection prompt for someone who rated their sleep quality as ${score} out of 5.`,
            },
          ],
          max_tokens: 150,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const prompt = data.choices[0]?.message?.content?.trim() || '';

      return {
        prompt,
        type: promptType,
      };
    } catch (error) {
      console.error('Error generating reflection prompt:', error);
      
      // Return fallback prompt if API fails
      return this.getFallbackPrompt(score);
    }
  }

  // Determine prompt type based on score
  private getPromptType(score: number): 'stress' | 'neutral' | 'gratitude' {
    if (score <= 2) return 'stress';
    if (score >= 4) return 'gratitude';
    return 'neutral';
  }

  // Get system prompt based on type
  private getSystemPrompt(type: 'stress' | 'neutral' | 'gratitude'): string {
    switch (type) {
      case 'stress':
        return `You are a compassionate sleep wellness coach. Generate a gentle, supportive reflection prompt for someone who had poor sleep. Focus on stress relief, self-compassion, and identifying factors that might have contributed to poor sleep. Keep it encouraging and avoid being judgmental. The prompt should be 1-2 sentences and help them process their experience constructively.`;
      
      case 'gratitude':
        return `You are a positive psychology coach focused on sleep wellness. Generate an uplifting reflection prompt for someone who had good sleep. Focus on gratitude, positive habits, and reinforcing what went well. The prompt should be 1-2 sentences and help them appreciate their good sleep while identifying what contributed to it.`;
      
      case 'neutral':
        return `You are a mindful sleep wellness coach. Generate a balanced reflection prompt for someone who had average sleep. Focus on mindful observation, gentle curiosity about sleep patterns, and neutral self-reflection. The prompt should be 1-2 sentences and encourage honest self-assessment without judgment.`;
    }
  }

  // Fallback prompts if OpenAI API is unavailable
  private getFallbackPrompt(score: number): OpenAIResponse {
    const type = this.getPromptType(score);
    
    const fallbackPrompts = {
      stress: [
        "What thoughts or worries might have kept you from restful sleep last night?",
        "How can you show yourself compassion after a difficult night's sleep?",
        "What's one small thing you can do today to prepare for better sleep tonight?",
      ],
      neutral: [
        "What did you notice about your sleep environment or routine last night?",
        "How is your current sleep pattern serving your daily energy and mood?",
        "What's one aspect of your sleep you'd like to pay attention to this week?",
      ],
      gratitude: [
        "What are you most grateful for about your sleep experience last night?",
        "How did good sleep contribute to your wellbeing today?",
        "What sleep habits or conditions supported your restful night?",
      ],
    };

    const prompts = fallbackPrompts[type];
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];

    return {
      prompt: randomPrompt,
      type,
    };
  }

  // Generate insights for premium users
  async generateSleepInsights(
    sleepLogs: Array<{ date: string; score: number; hours: number; journal?: string }>
  ): Promise<string> {
    try {
      if (!this.apiKey) {
        return this.getFallbackInsight(sleepLogs);
      }

      const sleepSummary = sleepLogs.map(log => 
        `${log.date}: Score ${log.score}, ${log.hours}h sleep${log.journal ? ', with journal entry' : ''}`
      ).join('\n');

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a sleep wellness expert. Analyze the user's sleep data and provide personalized insights and recommendations. Focus on patterns, trends, and actionable advice. Keep it encouraging and practical. Limit response to 2-3 sentences.`,
            },
            {
              role: 'user',
              content: `Analyze my recent sleep data and provide insights:\n\n${sleepSummary}`,
            },
          ],
          max_tokens: 200,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content?.trim() || this.getFallbackInsight(sleepLogs);
    } catch (error) {
      console.error('Error generating sleep insights:', error);
      return this.getFallbackInsight(sleepLogs);
    }
  }

  private getFallbackInsight(sleepLogs: Array<{ score: number; hours: number }>): string {
    if (sleepLogs.length === 0) {
      return "Keep logging your sleep to discover personalized insights about your sleep patterns!";
    }

    const avgScore = sleepLogs.reduce((sum, log) => sum + log.score, 0) / sleepLogs.length;
    const avgHours = sleepLogs.reduce((sum, log) => sum + log.hours, 0) / sleepLogs.length;

    if (avgScore >= 4) {
      return `Your sleep quality is excellent with an average score of ${avgScore.toFixed(1)}! You're averaging ${avgHours.toFixed(1)} hours per night, which seems to be working well for you.`;
    } else if (avgScore <= 2) {
      return `Your recent sleep scores average ${avgScore.toFixed(1)}, suggesting some challenges. Consider reviewing your bedtime routine and sleep environment for improvements.`;
    } else {
      return `Your sleep is fairly consistent with an average score of ${avgScore.toFixed(1)}. Small adjustments to your routine might help you reach even better quality sleep.`;
    }
  }
}

export default new OpenAIService();
