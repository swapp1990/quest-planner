import { useState, useCallback } from 'react';
import { usePurchases } from './PurchasesContext';

export const usePurchaseActions = () => {
  const { offerings, purchasePackage, restorePurchases } = usePurchases();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [error, setError] = useState(null);

  const getPackages = useCallback(() => {
    return offerings?.current?.availablePackages || [];
  }, [offerings]);

  const getMonthlyPackage = useCallback(() => {
    const packages = getPackages();
    return packages.find((pkg) => pkg.packageType === 'MONTHLY');
  }, [getPackages]);

  const getAnnualPackage = useCallback(() => {
    const packages = getPackages();
    return packages.find((pkg) => pkg.packageType === 'ANNUAL');
  }, [getPackages]);

  const handlePurchase = useCallback(async (pkg) => {
    if (!pkg) {
      setError('No package selected');
      return { success: false };
    }

    setIsPurchasing(true);
    setError(null);

    try {
      const result = await purchasePackage(pkg);
      if (!result.success && !result.userCancelled) {
        setError(result.error?.message || 'Purchase failed');
      }
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err };
    } finally {
      setIsPurchasing(false);
    }
  }, [purchasePackage]);

  const handleRestore = useCallback(async () => {
    setIsRestoring(true);
    setError(null);

    try {
      const result = await restorePurchases();
      if (!result.success) {
        setError(result.error?.message || 'Restore failed');
      }
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err };
    } finally {
      setIsRestoring(false);
    }
  }, [restorePurchases]);

  return {
    isPurchasing,
    isRestoring,
    error,
    getPackages,
    getMonthlyPackage,
    getAnnualPackage,
    handlePurchase,
    handleRestore,
  };
};
