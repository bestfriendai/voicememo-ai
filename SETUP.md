# VoiceMemo AI - Setup Guide

## Prerequisites

### Required Tools
- **Node.js** 18+ (LTS recommended)
- **npm** or **yarn**
- **Expo CLI**: `npm install -g expo-cli`
- **Xcode** (for iOS builds, macOS only)
- **Android Studio** (for Android builds)

### Accounts Required
- **Apple Developer Account** ($99/year) - for iOS App Store
- **Google Play Console** ($25 one-time) - for Android
- **RevenueCat Account** - for subscription management (free tier available)

---

## Installation

### 1. Navigate to the project directory
```bash
cd builds/voicememo-ai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npx expo start
```

### 4. Run on iOS Simulator
```bash
npx expo start --ios
```

### 5. Run on Android Emulator
```bash
npx expo start --android
```

---

## RevenueCat Setup

### Step 1: Create RevenueCat Account
1. Go to [revenuecat.com](https://www.revenuecat.com)
2. Sign up for a free account
3. Create a new project for VoiceMemo AI

### Step 2: Configure Products
In your RevenueCat dashboard:

1. **Monthly Subscription**
   - Product ID: `voicememo_ai_monthly`
   - Price: $4.99/month
   - Duration: 1 month

2. **Annual Subscription**
   - Product ID: `voicememo_ai_annual`
   - Price: $39.99/year
   - Duration: 1 year

### Step 3: Get API Keys
1. In RevenueCat, go to **Project Settings** → **API Keys**
2. Copy your **Apple App-Specific Shared Secret**
3. Copy your **Google Play Service Key**

### Step 4: Add API Keys to Code
Edit `src/services/purchases.ts`:
```typescript
export const REVENUECAT_API_KEYS = {
  ios: 'appl_your_ios_api_key_here',
  android: 'goog_your_android_api_key_here',
};
```

---

## App Store Connect Setup

### iOS Configuration
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Create a new app:
   - Name: VoiceMemo AI
   - Bundle ID: com.voicememo.ai
   - Platform: iOS

### Required Assets
- **App Icon**: 1024x1024 PNG (App Store)
- **Screenshots**: 6-8 screenshots (iPhone 6.7", iPhone 5.5")

### Privacy Details
Add these to App Store Connect:
- Privacy Policy URL (required)
- Category: Productivity

---

## Google Play Console Setup

### Android Configuration
1. Go to [Google Play Console](https://play.google.com/console)
2. Create a new app:
   - Name: VoiceMemo AI
   - Package Name: com.voicememo.ai

### Required Assets
- **App Icon**: 512x512 PNG
- **Feature Graphic**: 1024x500 PNG
- **Screenshots**: Phone + Tablet (min 2 each)

---

## EAS Build (Recommended)

### Install EAS CLI
```bash
npm install -g eas-cli
```

### Configure EAS
```bash
eas build:configure
```

### Build for iOS (Development)
```bash
eas build -p ios --profile development
```

### Build for iOS (Production)
```bash
eas build -p ios --profile production
```

### Build for Android
```bash
eas build -p android --profile production
```

---

## Submission Checklist

### Pre-Submission
- [ ] Test on physical iOS device
- [ ] Test on physical Android device
- [ ] Verify all features work offline
- [ ] Test premium purchase flow (use sandbox)
- [ ] Review all App Store metadata
- [ ] Prepare screenshots
- [ ] Prepare privacy policy URL

### App Store Review Guidelines
- [ ] No crashes or bugs
- [ ] All links work properly
- [ ] Privacy policy is accessible
- [ ] No placeholder content
- [ ] In-app purchases work correctly
- [ ] App icon matches all sizes

### Android Specific
- [ ] Test APK/ABB works without Google Play Services
- [ ] All permissions are justified
- [ ] App ads comply with policies

---

## Troubleshooting

### Common Issues

**Expo not starting**
```bash
# Clear cache and restart
npx expo start --clear
```

**Build errors**
```bash
# Reset native directories
npx expo install --fix
```

**RevenueCat not working**
- Verify API keys are correct
- Check product IDs match exactly
- Test in sandbox mode first

---

## Support

For issues or questions:
- Email: support@voicememo.ai
- Website: https://voicememo.ai

---

**VoiceMemo AI v1.0.0**
Built with ❤️ using Expo
