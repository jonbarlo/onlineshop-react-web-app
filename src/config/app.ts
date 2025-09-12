import { AppConfig } from '@/types';

export const appConfig: AppConfig = {
  siteName: import.meta.env.VITE_SITE_NAME || 'Shop 506',
  siteDescription: import.meta.env.VITE_SITE_DESCRIPTION || 'Online Store',
};

export const getSiteTitle = (pageTitle?: string): string => {
  if (pageTitle) {
    return `${pageTitle} - ${appConfig.siteName}`;
  }
  return appConfig.siteName;
};
