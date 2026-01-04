import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Purchases from 'react-native-purchases';
import { REVENUECAT_API_KEY, ENTITLEMENTS } from './config';

const PurchasesContext = createContext(null);

export const PurchasesProvider = ({ userId, children }) => {
  const [isReady, setIsReady] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [offerings, setOfferings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize RevenueCat
  useEffect(() => {
    initializePurchases();
  }, []);

  // Handle user login/logout
  useEffect(() => {
    if (isReady) {
      handleUserChange();
    }
  }, [userId, isReady]);

  const initializePurchases = async () => {
    try {
      await Purchases.configure({ apiKey: REVENUECAT_API_KEY });
      setIsReady(true);
      await fetchOfferings();
      await refreshCustomerInfo();
    } catch (err) {
      console.error('Failed to initialize RevenueCat:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserChange = async () => {
    try {
      if (userId) {
        await Purchases.logIn(userId);
        await refreshCustomerInfo();
      }
      // Don't call logOut - RevenueCat handles anonymous users automatically
    } catch (err) {
      console.error('Failed to handle user change:', err);
    }
  };

  const fetchOfferings = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      setOfferings(offerings);
      return offerings;
    } catch (err) {
      console.error('Failed to fetch offerings:', err);
      setError(err.message);
      return null;
    }
  };

  const refreshCustomerInfo = useCallback(async () => {
    try {
      const info = await Purchases.getCustomerInfo();
      setCustomerInfo(info);

      // Check if user has premium entitlement
      const hasPremium = info.entitlements.active[ENTITLEMENTS.PREMIUM] !== undefined;
      setIsPremium(hasPremium);

      return info;
    } catch (err) {
      console.error('Failed to refresh customer info:', err);
      setError(err.message);
      return null;
    }
  }, []);

  const purchasePackage = async (pkg) => {
    try {
      setError(null);
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      setCustomerInfo(customerInfo);

      const hasPremium = customerInfo.entitlements.active[ENTITLEMENTS.PREMIUM] !== undefined;
      setIsPremium(hasPremium);

      return { success: true, customerInfo };
    } catch (err) {
      if (!err.userCancelled) {
        console.error('Purchase failed:', err);
        setError(err.message);
      }
      return { success: false, error: err, userCancelled: err.userCancelled };
    }
  };

  const restorePurchases = async () => {
    try {
      setError(null);
      const info = await Purchases.restorePurchases();
      setCustomerInfo(info);

      const hasPremium = info.entitlements.active[ENTITLEMENTS.PREMIUM] !== undefined;
      setIsPremium(hasPremium);

      return { success: true, customerInfo: info };
    } catch (err) {
      console.error('Restore failed:', err);
      setError(err.message);
      return { success: false, error: err };
    }
  };

  return (
    <PurchasesContext.Provider
      value={{
        isReady,
        isPremium,
        customerInfo,
        offerings,
        isLoading,
        error,
        purchasePackage,
        restorePurchases,
        refreshCustomerInfo,
      }}
    >
      {children}
    </PurchasesContext.Provider>
  );
};

export const usePurchases = () => {
  const context = useContext(PurchasesContext);
  if (!context) {
    throw new Error('usePurchases must be used within PurchasesProvider');
  }
  return context;
};
