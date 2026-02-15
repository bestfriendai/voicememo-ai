// VoiceMemo AI - AI Processing Service
// Mock implementation for demo purposes
// In production, connect to OpenAI Whisper API or similar

export interface TranscriptionResult {
  transcript: string;
  summary: string;
  tags: string[];
}

// Mock AI transcription and summary
// In production, replace with actual API calls
export const transcribeAndSummarize = async (
  audioUri: string
): Promise<TranscriptionResult> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Mock transcript based on random generation
  // In production, use OpenAI Whisper API
  const mockTranscripts = [
    "Remember to call John about the project deadline tomorrow. Also need to follow up with Sarah about the budget meeting.",
    "Ideas for the new marketing campaign: social media ads, influencer partnerships, email newsletter, and blog content.",
    "Meeting notes from today: discussed Q4 goals, reviewed team performance, and planned the product launch for next month.",
    "Grocery list: milk, eggs, bread, butter, cheese, vegetables, fruits, and chicken breast.",
    "Book recommendations: Atomic Habits, Deep Work, The Psychology of Money, and Start with Why.",
  ];

  const mockSummaries = [
    "Call John about project deadline. Follow up with Sarah on budget.",
    "Marketing campaign ideas: social ads, influencers, email, blog content.",
    "Q4 goals and product launch planning discussed.",
    "Shopping list for groceries.",
    "Productivity and business book recommendations.",
  ];

  const mockTags = [
    ['work', 'call', 'follow-up'],
    ['marketing', 'campaign', 'ideas'],
    ['meeting', 'goals', 'planning'],
    ['shopping', 'groceries'],
    ['books', 'recommendations', 'productivity'],
  ];

  // Random selection for demo
  const index = Math.floor(Math.random() * mockTranscripts.length);

  return {
    transcript: mockTranscripts[index],
    summary: mockSummaries[index],
    tags: mockTags[index],
  };
};

// Generate title from transcript
export const generateTitle = (transcript: string): string => {
  const firstSentence = transcript.split('.')[0];
  if (firstSentence.length > 30) {
    return firstSentence.substring(0, 30) + '...';
  }
  return firstSentence;
};

// Format duration from milliseconds to readable string
export const formatDuration = (millis: number): string => {
  const seconds = Math.floor(millis / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `0:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Format timestamp to readable date
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  }
};
