// VoiceMemo AI - RevenueCat Service
import { Platform } from 'react-native';

// RevenueCat configuration
// Replace these with your actual RevenueCat API keys
export const REVENUECAT_API_KEYS = {
  ios: 'appl_your_ios_api_key_here',
  android: 'goog_your_android_api_key_here',
};

// Product IDs (configure in RevenueCat dashboard)
export const PRODUCT_IDS = {
  monthly: 'voicememo_ai_monthly',
  annual: 'voicememo_ai_annual',
};

// RevenueCat entitlement ID
export const ENTITLEMENT_ID = 'premium_features';

export interface Offering {
  id: string;
  description: string;
  price: string;
  pricePerMonth: string;
  productId: string;
  isBestValue?: boolean;
}

// Mock offerings for display (actual products configured in RevenueCat)
export const OFFERINGS: Offering[] = [
  {
    id: 'monthly',
    description: 'Unlimited AI transcriptions & summaries',
    price: '$4.99/month',
    pricePerMonth: '$4.99',
    productId: PRODUCT_IDS.monthly,
  },
  {
    id: 'annual',
    description: 'Unlimited AI transcriptions & summaries',
    price: '$39.99/year',
    pricePerMonth: '$3.33',
    productId: PRODUCT_IDS.annual,
    isBestValue: true,
  },
];

// Check if user has premium (mock implementation)
// In production, integrate with actual RevenueCat SDK
export const checkPremiumStatus = async (): Promise<boolean> => {
  try {
    // This would use Purchases.getCustomerInfo() in production
    // For now, we use local storage
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    const premium = await AsyncStorage.getItem('voicememo_premium');
    return premium === 'true';
  } catch {
    return false;
  }
};

// Purchase subscription (mock implementation)
// In production, use Purchases.purchaseStoreProduct()
export const purchaseSubscription = async (productId: string): Promise<boolean> => {
  try {
    // Mock successful purchase
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    await AsyncStorage.setItem('voicememo_premium', 'true');
    return true;
  } catch {
    return false;
  }
};

// Restore purchases (mock implementation)
export const restorePurchases = async (): Promise<boolean> => {
  try {
    // In production, use Purchases.restoreTransactions()
    return true;
  } catch {
    return false;
  }
};
