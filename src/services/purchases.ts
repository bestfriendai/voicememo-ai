// VoiceMemo AI - RevenueCat Service
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// RevenueCat configuration
// Replace these with your actual RevenueCat API keys
// Set in environment variables:
// - EXPO_PUBLIC_REVENUECAT_IOS_KEY
// - EXPO_PUBLIC_REVENUECAT_ANDROID_KEY
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

// Toggle for using RevenueCat vs local storage
// Set to true when ready to integrate with RevenueCat
const USE_REVENUECAT = false;

export interface Offering {
  id: string;
  description: string;
  price: string;
  pricePerMonth: string;
  productId: string;
  isBestValue?: boolean;
}

// Offerings for display (configure prices in RevenueCat dashboard)
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

const PREMIUM_KEY = 'voicememo_premium';

// Check if user has premium status
export async function checkPremiumStatus(): Promise<boolean> {
  if (USE_REVENUECAT) {
    return checkPremiumStatusRevenueCat();
  }
  return checkPremiumStatusLocal();
}

// Local storage-based premium check (development/demo)
async function checkPremiumStatusLocal(): Promise<boolean> {
  try {
    const premium = await AsyncStorage.getItem(PREMIUM_KEY);
    return premium === 'true';
  } catch {
    return false;
  }
}

// RevenueCat-based premium check (production)
// To enable: set USE_REVENUECAT = true and install @revenuecat/purchases
async function checkPremiumStatusRevenueCat(): Promise<boolean> {
  try {
    // Import RevenueCat when enabled
    // const Purchases = require('@revenuecat/purchases').default;
    // const customerInfo = await Purchases.getCustomerInfo();
    // return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
    
    // Placeholder - RevenueCat integration not yet enabled
    console.warn('RevenueCat not yet configured. Set USE_REVENUECAT = true to enable.');
    return false;
  } catch (error) {
    console.error('Failed to check premium status:', error);
    return false;
  }
}

// Purchase subscription
export async function purchaseSubscription(productId: string): Promise<boolean> {
  if (USE_REVENUECAT) {
    return purchaseSubscriptionRevenueCat(productId);
  }
  return purchaseSubscriptionLocal(productId);
}

// Local storage-based purchase (development/demo)
async function purchaseSubscriptionLocal(productId: string): Promise<boolean> {
  try {
    // Simulate successful purchase for demo
    await AsyncStorage.setItem(PREMIUM_KEY, 'true');
    return true;
  } catch {
    return false;
  }
}

// RevenueCat-based purchase (production)
async function purchaseSubscriptionRevenueCat(productId: string): Promise<boolean> {
  try {
    // Import RevenueCat when enabled
    // const Purchases = require('@revenuecat/purchases').default;
    // const { product } = await Purchases.getOfferings();
    // await Purchases.purchaseStoreProduct(product);
    
    // Placeholder - RevenueCat integration not yet enabled
    console.warn('RevenueCat not yet configured. Set USE_REVENUECAT = true to enable.');
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

// Local storage-based restore (development/demo)
async function restorePurchasesLocal(): Promise<boolean> {
  // No-op for local storage
  return true;
}

// RevenueCat-based restore (production)
async function restorePurchasesRevenueCat(): Promise<boolean> {
  try {
    // Import RevenueCat when enabled
    // const Purchases = require('@revenuecat/purchases').default;
    // await Purchases.restoreTransactions();
    
    // Placeholder - RevenueCat integration not yet enabled
    return false;
  } catch (error) {
    console.error('Restore failed:', error);
    return false;
  }
}

// Initialize RevenueCat (call in app startup)
export async function initializeRevenueCat(): Promise<void> {
  if (!USE_REVENUECAT) return;
  
  try {
    // const Purchases = require('@revenuecat/purchases').default;
    // Purchases.configure({
    //   apiKey: Platform.OS === 'ios' ? REVENUECAT_API_KEYS.ios : REVENUECAT_API_KEYS.android,
    // });
    console.warn('RevenueCat not yet configured. Set USE_REVENUECAT = true to enable.');
  } catch (error) {
    console.error('Failed to initialize RevenueCat:', error);
  }
}
