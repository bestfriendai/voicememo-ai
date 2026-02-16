# API Keys Required for VoiceMemo AI

## Environment Variables

| Variable | Required | Service | Purpose |
|----------|----------|---------|---------|
| `EXPO_PUBLIC_OPENAI_API_KEY` | ✅ Yes | OpenAI | Whisper transcription + GPT summarization |
| `EXPO_PUBLIC_OPENAI_BASE_URL` | ❌ Optional | OpenAI | Custom API base URL (default: `https://api.openai.com/v1`) |
| `EXPO_PUBLIC_REVENUECAT_IOS_KEY` | ❌ Optional | RevenueCat | iOS in-app purchases |
| `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY` | ❌ Optional | RevenueCat | Android in-app purchases |

---

## 1. OpenAI API Key (Required)

**Used for:** Whisper speech-to-text transcription + GPT-4o-mini summarization

**Sign up:** https://platform.openai.com/signup

**Get API key:** https://platform.openai.com/api-keys

### Pricing (Pay-as-you-go)
- **Whisper API:** $0.006/minute of audio
- **GPT-4o-mini:** $0.15/1M input tokens, $0.60/1M output tokens
- **Estimated cost per memo:** ~$0.01–0.05 (depending on length)
- **Free tier:** $5 credit for new accounts

### Models Used
- `whisper-1` — Audio transcription
- `gpt-4o-mini` — Transcript summarization & tag extraction

---

## 2. RevenueCat (Optional — for monetization)

**Used for:** Managing in-app subscriptions and purchases

**Sign up:** https://www.revenuecat.com

**Get API keys:** RevenueCat Dashboard → Project → API Keys

### Pricing
- **Free tier:** Up to $2,500/month in tracked revenue
- **Starter:** $0 + 1% of revenue over $2,500/month
- **Pro:** Custom pricing

### Setup
1. Create a RevenueCat account
2. Create a new project
3. Add your App Store / Play Store app
4. Copy the public API keys (iOS + Android)

---

## Example `.env` File

```bash
# Required - OpenAI
EXPO_PUBLIC_OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxx

# Optional - Custom OpenAI base URL (e.g., for Azure OpenAI)
# EXPO_PUBLIC_OPENAI_BASE_URL=https://api.openai.com/v1

# Optional - RevenueCat (for production monetization)
# EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_xxxxxxxxxxxxxxxxxxxx
# EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_xxxxxxxxxxxxxxxxxxxx
```

## Quick Start

```bash
cp .env.example .env
# Edit .env with your API keys
npx expo start
```
