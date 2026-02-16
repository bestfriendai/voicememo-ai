// Vocap - AI Processing Service
// Uses OpenAI Whisper for transcription and GPT for summarization

export interface TranscriptionResult {
  transcript: string;
  summary: string;
  tags: string[];
}

// OpenAI API configuration
// Set OPENAI_API_KEY in your environment variables
const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || '';
const OPENAI_BASE_URL = process.env.EXPO_PUBLIC_OPENAI_BASE_URL || 'https://api.openai.com/v1';

interface OpenAIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Transcribe audio using OpenAI Whisper API
async function transcribeAudio(audioUri: string): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured. Set EXPO_PUBLIC_OPENAI_API_KEY environment variable.');
  }

  // Fetch the audio file
  const response = await fetch(audioUri);
  const audioBlob = await response.blob();

  // Create FormData for Whisper API
  const formData = new FormData();
  formData.append('file', audioBlob as any, 'audio.m4a');
  formData.append('model', 'whisper-1');
  formData.append('response_format', 'json');

  const transcriptionResponse = await fetch(`${OPENAI_BASE_URL}/audio/transcriptions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: formData,
  });

  if (!transcriptionResponse.ok) {
    const error = await transcriptionResponse.text();
    throw new Error(`Transcription failed: ${error}`);
  }

  const result = await transcriptionResponse.json();
  return result.text || '';
}

// Summarize transcript using OpenAI GPT
async function summarizeTranscript(transcript: string): Promise<{ summary: string; tags: string[] }> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured. Set EXPO_PUBLIC_OPENAI_API_KEY environment variable.');
  }

  const messages: OpenAIMessage[] = [
    {
      role: 'system',
      content: 'You are a helpful assistant that summarizes voice memos. Provide a brief summary and extract 3-5 relevant tags.',
    },
    {
      role: 'user',
      content: `Please summarize this voice memo and provide 3-5 tags:\n\n${transcript}\n\nFormat your response as JSON with "summary" and "tags" fields.`,
    },
  ];

  const summaryResponse = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  if (!summaryResponse.ok) {
    const error = await summaryResponse.text();
    throw new Error(`Summary failed: ${error}`);
  }

  const result = await summaryResponse.json();
  const content = result.choices?.[0]?.message?.content || '';

  try {
    // Try to parse JSON response
    const parsed = JSON.parse(content);
    return {
      summary: parsed.summary || content,
      tags: Array.isArray(parsed.tags) ? parsed.tags : [],
    };
  } catch {
    // If not valid JSON, return the raw content as summary
    return {
      summary: content,
      tags: [],
    };
  }
}

// Main function: transcribe and summarize audio
export const transcribeAndSummarize = async (
  audioUri: string
): Promise<TranscriptionResult> => {
  // Check if API key is configured
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured. Please set EXPO_PUBLIC_OPENAI_API_KEY in your environment.');
  }

  // Transcribe audio
  const transcript = await transcribeAudio(audioUri);

  // Summarize transcript
  const { summary, tags } = await summarizeTranscript(transcript);

  return {
    transcript,
    summary,
    tags,
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
