import Purchases, {
    CustomerInfo,
    PurchasesOffering,
    PurchasesPackage
} from 'react-native-purchases';
import { SubscriptionStatus } from '../types';

class RevenueCatService {
  private isInitialized = false;

  // Initialize RevenueCat
  async initialize(userId?: string): Promise<void> {
    try {
      // Configure RevenueCat with your API key
      const apiKey = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY;
      
      if (!apiKey) {
        console.warn('RevenueCat API key not configured');
        return;
      }

      await Purchases.configure({ apiKey });
      
      if (userId) {
        await Purchases.logIn(userId);
      }

      this.isInitialized = true;
      console.log('RevenueCat initialized successfully');
    } catch (error) {
      console.error('RevenueCat initialization error:', error);
    }
  }

  // Log in user
  async logIn(userId: string): Promise<void> {
    try {
      if (!this.isInitialized) {
        await this.initialize(userId);
        return;
      }

      await Purchases.logIn(userId);
    } catch (error) {
      console.error('RevenueCat login error:', error);
      throw error;
    }
  }

  // Log out user
  async logOut(): Promise<void> {
    try {
      await Purchases.logOut();
    } catch (error) {
      console.error('RevenueCat logout error:', error);
      throw error;
    }
  }

  // Get current offerings
  async getOfferings(): Promise<PurchasesOffering[]> {
    try {
      const offerings = await Purchases.getOfferings();
      return Object.values(offerings.all);
    } catch (error) {
      console.error('Error getting offerings:', error);
      return [];
    }
  }

  // Get premium packages
  async getPremiumPackages(): Promise<PurchasesPackage[]> {
    try {
      const offerings = await Purchases.getOfferings();
      const currentOffering = offerings.current;
      
      if (currentOffering) {
        return currentOffering.availablePackages;
      }
      
      return [];
    } catch (error) {
      console.error('Error getting premium packages:', error);
      return [];
    }
  }

  // Purchase package
  async purchasePackage(packageToPurchase: PurchasesPackage): Promise<{
    success: boolean;
    customerInfo?: CustomerInfo;
    error?: string;
  }> {
    try {
      const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
      
      return {
        success: true,
        customerInfo,
      };
    } catch (error: any) {
      console.error('Purchase error:', error);
      
      // Handle specific purchase errors
      if (error.code === 'PURCHASE_CANCELLED') {
        return {
          success: false,
          error: 'Purchase was cancelled',
        };
      } else if (error.code === 'ITEM_ALREADY_OWNED') {
        return {
          success: false,
          error: 'You already own this subscription',
        };
      } else {
        return {
          success: false,
          error: error.message || 'Purchase failed',
        };
      }
    }
  }

  // Restore purchases
  async restorePurchases(): Promise<{
    success: boolean;
    customerInfo?: CustomerInfo;
    error?: string;
  }> {
    try {
      const customerInfo = await Purchases.restorePurchases();
      
      return {
        success: true,
        customerInfo,
      };
    } catch (error: any) {
      console.error('Restore purchases error:', error);
      return {
        success: false,
        error: error.message || 'Failed to restore purchases',
      };
    }
  }

  // Get customer info
  async getCustomerInfo(): Promise<CustomerInfo | null> {
    try {
      return await Purchases.getCustomerInfo();
    } catch (error) {
      console.error('Error getting customer info:', error);
      return null;
    }
  }

  // Check if user has premium access
  async isPremiumUser(): Promise<boolean> {
    try {
      const customerInfo = await this.getCustomerInfo();
      
      if (!customerInfo) {
        return false;
      }

      // Check if user has active premium entitlement
      return customerInfo.entitlements.active['premium'] !== undefined;
    } catch (error) {
      console.error('Error checking premium status:', error);
      return false;
    }
  }

  // Get subscription status
  async getSubscriptionStatus(): Promise<SubscriptionStatus> {
    try {
      const customerInfo = await this.getCustomerInfo();
      
      if (!customerInfo) {
        return { isActive: false };
      }

      const premiumEntitlement = customerInfo.entitlements.active['premium'];
      
      if (premiumEntitlement) {
        return {
          isActive: true,
          productId: premiumEntitlement.productIdentifier,
          expirationDate: premiumEntitlement.expirationDate ? new Date(premiumEntitlement.expirationDate) : undefined,
          originalPurchaseDate: premiumEntitlement.originalPurchaseDate ? new Date(premiumEntitlement.originalPurchaseDate) : undefined,
        };
      }

      return { isActive: false };
    } catch (error) {
      console.error('Error getting subscription status:', error);
      return { isActive: false };
    }
  }

  // Set up purchase listener
  setupPurchaseListener(callback: (customerInfo: CustomerInfo) => void): void {
    Purchases.addCustomerInfoUpdateListener(callback);
  }

  // Remove purchase listener
  removePurchaseListener(): void {
    Purchases.removeCustomerInfoUpdateListener();
  }

  // Get product prices for display
  async getProductPrices(): Promise<{
    monthly?: string;
    yearly?: string;
  }> {
    try {
      const packages = await this.getPremiumPackages();
      const prices: { monthly?: string; yearly?: string } = {};

      packages.forEach(pkg => {
        const price = pkg.product.priceString;
        
        if (pkg.packageType === 'MONTHLY') {
          prices.monthly = price;
        } else if (pkg.packageType === 'ANNUAL') {
          prices.yearly = price;
        }
      });

      return prices;
    } catch (error) {
      console.error('Error getting product prices:', error);
      return {};
    }
  }

  // Check if feature is available for current user
  async isFeatureAvailable(feature: 'export_reports' | 'unlimited_journals' | 'unlimited_history' | 'ai_insights' | 'custom_reminders'): Promise<boolean> {
    const isPremium = await this.isPremiumUser();
    
    // All premium features require premium subscription
    const premiumFeatures = ['export_reports', 'unlimited_journals', 'unlimited_history', 'ai_insights', 'custom_reminders'];
    
    if (premiumFeatures.includes(feature)) {
      return isPremium;
    }

    // Basic features are always available
    return true;
  }

  // Get trial eligibility
  async isEligibleForTrial(): Promise<boolean> {
    try {
      const customerInfo = await this.getCustomerInfo();
      
      if (!customerInfo) {
        return true; // New users are eligible for trial
      }

      // Check if user has ever had a subscription
      const hasHadSubscription = Object.keys(customerInfo.allPurchasedProductIdentifiers).length > 0;
      
      return !hasHadSubscription;
    } catch (error) {
      console.error('Error checking trial eligibility:', error);
      return false;
    }
  }
}

export default new RevenueCatService();
