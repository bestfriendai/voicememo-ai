# VoiceMemo AI

Smart voice recorder with AI transcription, summarization, and smart tagging.

## Features

- 🎙️ **One-Tap Recording** - Record voice memos instantly
- 📝 **AI Transcription** - Automatic speech-to-text conversion
- 📋 **Smart Summaries** - AI-generated summaries of your recordings
- 🏷️ **Auto-Tagging** - Intelligent tagging for easy organization
- 🔒 **Privacy First** - All data stored locally on your device

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI
- Xcode (iOS) / Android Studio (Android)

### Installation

```bash
cd builds/voicememo-ai
npm install
npx expo start
```

## Tech Stack

- Expo SDK 54
- React Native 0.79
- Expo Router
- Zustand (State Management)
- RevenueCat (Subscriptions)

## Premium Features

- Unlimited AI transcriptions
- Unlimited AI summaries
- Unlimited smart tags
- Priority support

## API Configuration

This app uses **OpenAI** for AI transcription and summarization.

### Required API Keys

Create a `.env` file in the project root:

```bash
# OpenAI API (for Whisper transcription + GPT summarization)
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key

# RevenueCat (for subscriptions - optional for basic functionality)
EXPO_PUBLIC_REVENUECAT_API_KEY=your_revenuecat_api_key
```

### Getting API Keys

1. **OpenAI API Key**:
   - Go to https://platform.openai.com/api-keys
   - Create a new secret key
   - Add payment method (pay-as-you-go pricing)

2. **RevenueCat** (optional, for premium):
   - Go to https://www.revenuecat.com
   - Create project and get API key
   - Configure products in App Store Connect / Google Play Console

### Type Checking

```bash
npx tsc --noEmit
```

## Building for Production

```bash
# iOS
eas build --platform ios

# Android
eas build --platform android
```

## License

MIT License
