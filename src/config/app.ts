import { AppConfig } from '@/types';

export const appConfig: AppConfig = {
  siteName: import.meta.env.VITE_SITE_NAME || 'Shop 506',
  siteDescription: import.meta.env.VITE_SITE_DESCRIPTION || 'Online Store',
  currency: import.meta.env.VITE_CURRENCY || 'USD',
  currencySymbol: import.meta.env.VITE_CURRENCY_SYMBOL || '$',
};

export const getSiteTitle = (pageTitle?: string): string => {
  if (pageTitle) {
    return `${pageTitle} - ${appConfig.siteName}`;
  }
  return appConfig.siteName;
};

export const formatCurrency = (amount: number): string => {
  const symbol = appConfig.currencySymbol;
  const currency = appConfig.currency;
  
  // For Costa Rica Colon (CRC), show symbol after the amount
  if (currency === 'CRC') {
    return `₡${amount.toLocaleString('es-CR')}`;
  }
  
  // For USD and other currencies, show symbol before the amount
  return `${symbol}${amount.toLocaleString()}`;
};
