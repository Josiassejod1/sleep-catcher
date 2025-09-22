import { OpenAIResponse } from '../types';

class MockOpenAIService {
  // Generate reflection prompt based on sleep score
  async generateReflectionPrompt(score: number): Promise<OpenAIResponse> {
    // Simulate API delay
    await this.delay(800);

    const promptType = this.getPromptType(score);
    const prompt = this.getPromptForScore(score);

    return {
      prompt,
      type: promptType,
    };
  }

  // Determine prompt type based on score
  private getPromptType(score: number): 'stress' | 'neutral' | 'gratitude' {
    if (score <= 2) return 'stress';
    if (score >= 4) return 'gratitude';
    return 'neutral';
  }

  // Get mock prompt based on score
  private getPromptForScore(score: number): string {
    const prompts = {
      1: [
        "It sounds like last night was challenging. What thoughts or worries might have kept you from restful sleep?",
        "Poor sleep can be frustrating. What's one small thing you can do today to prepare for better sleep tonight?",
        "How can you show yourself compassion after a difficult night's sleep?",
      ],
      2: [
        "Your sleep wasn't ideal, but that's okay. What factors might have contributed to feeling less rested?",
        "What strategies could help you manage any stress or tension before bedtime?",
        "How did you feel when you woke up, and what might help you feel more refreshed tomorrow?",
      ],
      3: [
        "Your sleep was decent. What did you notice about your sleep environment or routine last night?",
        "How is your current sleep pattern serving your daily energy and mood?",
        "What's one aspect of your sleep you'd like to pay attention to this week?",
      ],
      4: [
        "You had a good night's sleep! What sleep habits or conditions supported your restful night?",
        "How did good sleep contribute to your wellbeing today?",
        "What are you most grateful for about your sleep experience last night?",
      ],
      5: [
        "Excellent sleep! What are you most grateful for about your sleep experience last night?",
        "How did this amazing sleep set you up for success today?",
        "What perfect conditions came together to give you such wonderful rest?",
      ],
    };

    const scorePrompts = prompts[score as keyof typeof prompts] || prompts[3];
    const randomIndex = Math.floor(Math.random() * scorePrompts.length);
    return scorePrompts[randomIndex];
  }

  // Generate insights for premium users
  async generateSleepInsights(
    sleepLogs: Array<{ date: string; score: number; hours: number; journal?: string }>
  ): Promise<string> {
    await this.delay(1200);

    if (sleepLogs.length === 0) {
      return "Keep logging your sleep to discover personalized insights about your sleep patterns!";
    }

    const avgScore = sleepLogs.reduce((sum, log) => sum + log.score, 0) / sleepLogs.length;
    const avgHours = sleepLogs.reduce((sum, log) => sum + log.hours, 0) / sleepLogs.length;

    // Generate insights based on patterns
    const insights = [];

    if (avgScore >= 4) {
      insights.push(`Your sleep quality is excellent with an average score of ${avgScore.toFixed(1)}!`);
    } else if (avgScore <= 2) {
      insights.push(`Your recent sleep scores average ${avgScore.toFixed(1)}, suggesting some challenges.`);
    } else {
      insights.push(`Your sleep is fairly consistent with an average score of ${avgScore.toFixed(1)}.`);
    }

    if (avgHours < 6) {
      insights.push("Consider prioritizing more sleep time for better recovery.");
    } else if (avgHours > 9) {
      insights.push("You might benefit from a more consistent sleep schedule.");
    } else {
      insights.push(`You're averaging ${avgHours.toFixed(1)} hours per night, which seems to be working well for you.`);
    }

    // Add pattern-based insights
    const scores = sleepLogs.map(log => log.score);
    const isImproving = scores.slice(-3).every((score, i, arr) => i === 0 || score >= arr[i - 1]);
    const isDeclining = scores.slice(-3).every((score, i, arr) => i === 0 || score <= arr[i - 1]);

    if (isImproving) {
      insights.push("Great news - your sleep quality has been improving recently!");
    } else if (isDeclining) {
      insights.push("Your sleep scores have been declining lately - consider reviewing your sleep routine.");
    }

    return insights.join(" ");
  }

  // Helper method to simulate async operations
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new MockOpenAIService();
