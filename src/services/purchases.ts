// Vocap - RevenueCat Service
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// RevenueCat configuration
export const REVENUECAT_API_KEYS = {
  ios: 'appl_your_ios_api_key_here',
  android: 'goog_your_android_api_key_here',
};

// Product IDs
export const PRODUCT_IDS = {
  monthly: 'voicememo_ai_monthly',
  annual: 'voicememo_ai_annual',
};

export const ENTITLEMENT_ID = 'premium_features';

const USE_REVENUECAT = false;

// Free tier limits
export const FREE_LIMITS = {
  maxRecordingsPerMonth: 5,
  maxRecordingDurationSeconds: 30,
};

export interface Offering {
  id: string;
  description: string;
  price: string;
  pricePerMonth: string;
  productId: string;
  isBestValue?: boolean;
  trialText?: string;
}

export const OFFERINGS: Offering[] = [
  {
    id: 'monthly',
    description: 'Unlimited recordings, AI summaries & export',
    price: '$4.99/month',
    pricePerMonth: '$4.99',
    productId: PRODUCT_IDS.monthly,
  },
  {
    id: 'annual',
    description: 'Unlimited recordings, AI summaries & export',
    price: '$39.99/year',
    pricePerMonth: '$3.33',
    productId: PRODUCT_IDS.annual,
    isBestValue: true,
    trialText: '3-day free trial',
  },
];

const PREMIUM_KEY = 'voicememo_premium';
const RECORDING_COUNT_KEY = 'voicememo_recording_count';
const RECORDING_COUNT_MONTH_KEY = 'voicememo_recording_count_month';

// Get current month key (YYYY-MM)
function getCurrentMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

// Get monthly recording count
export async function getMonthlyRecordingCount(): Promise<number> {
  try {
    const [countStr, monthStr] = await AsyncStorage.multiGet([
      RECORDING_COUNT_KEY,
      RECORDING_COUNT_MONTH_KEY,
    ]);
    const storedMonth = monthStr[1];
    const currentMonth = getCurrentMonthKey();

    if (storedMonth !== currentMonth) {
      // Reset for new month
      await AsyncStorage.multiSet([
        [RECORDING_COUNT_KEY, '0'],
        [RECORDING_COUNT_MONTH_KEY, currentMonth],
      ]);
      return 0;
    }

    return parseInt(countStr[1] || '0', 10);
  } catch {
    return 0;
  }
}

// Increment monthly recording count
export async function incrementMonthlyRecordingCount(): Promise<void> {
  try {
    const currentMonth = getCurrentMonthKey();
    const count = await getMonthlyRecordingCount();
    await AsyncStorage.multiSet([
      [RECORDING_COUNT_KEY, String(count + 1)],
      [RECORDING_COUNT_MONTH_KEY, currentMonth],
    ]);
  } catch {
    // ignore
  }
}

// Check if user can record
export async function canRecord(): Promise<{ allowed: boolean; reason?: string }> {
  try {
    const premium = await AsyncStorage.getItem(PREMIUM_KEY);
    if (premium === 'true') {
      return { allowed: true };
    }

    const count = await getMonthlyRecordingCount();
    if (count >= FREE_LIMITS.maxRecordingsPerMonth) {
      return {
        allowed: false,
        reason: `You've used all ${FREE_LIMITS.maxRecordingsPerMonth} free recordings this month. Upgrade to Premium for unlimited recordings.`,
      };
    }

    return { allowed: true };
  } catch {
    return { allowed: true };
  }
}

// Check if user can access a premium feature
export async function canAccessFeature(
  feature: 'ai_summary' | 'export' | 'unlimited_length'
): Promise<boolean> {
  try {
    const premium = await AsyncStorage.getItem(PREMIUM_KEY);
    return premium === 'true';
  } catch {
    return false;
  }
}

// Check premium status
export async function checkPremiumStatus(): Promise<boolean> {
  if (USE_REVENUECAT) {
    return checkPremiumStatusRevenueCat();
  }
  return checkPremiumStatusLocal();
}

async function checkPremiumStatusLocal(): Promise<boolean> {
  try {
    const premium = await AsyncStorage.getItem(PREMIUM_KEY);
    return premium === 'true';
  } catch {
    return false;
  }
}

async function checkPremiumStatusRevenueCat(): Promise<boolean> {
  try {
    console.warn('RevenueCat not yet configured.');
    return false;
  } catch (error) {
    console.error('Failed to check premium status:', error);
    return false;
  }
}

// Purchase subscription (with realistic delay)
export async function purchaseSubscription(productId: string): Promise<boolean> {
  if (USE_REVENUECAT) {
    return purchaseSubscriptionRevenueCat(productId);
  }
  return purchaseSubscriptionLocal(productId);
}

async function purchaseSubscriptionLocal(productId: string): Promise<boolean> {
  try {
    // Simulate purchase processing delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    await AsyncStorage.setItem(PREMIUM_KEY, 'true');
    return true;
  } catch {
    return false;
  }
}

async function purchaseSubscriptionRevenueCat(productId: string): Promise<boolean> {
  try {
    console.warn('RevenueCat not yet configured.');
    return false;
  } catch (error) {
    console.error('Purchase failed:', error);
    return false;
  }
}

// Restore purchases
export async function restorePurchases(): Promise<boolean> {
  if (USE_REVENUECAT) {
    return restorePurchasesRevenueCat();
  }
  return restorePurchasesLocal();
}

async function restorePurchasesLocal(): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const premium = await AsyncStorage.getItem(PREMIUM_KEY);
  return premium === 'true';
}

async function restorePurchasesRevenueCat(): Promise<boolean> {
  try {
    return false;
  } catch (error) {
    console.error('Restore failed:', error);
    return false;
  }
}

// Initialize RevenueCat
export async function initializeRevenueCat(): Promise<void> {
  if (!USE_REVENUECAT) return;
  try {
    console.warn('RevenueCat not yet configured.');
  } catch (error) {
    console.error('Failed to initialize RevenueCat:', error);
  }
}
