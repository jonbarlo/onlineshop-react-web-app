import { useEffect } from 'react';
import { useBrandTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

export const useDocumentTitle = (pageTitleKey?: string) => {
  const { theme, loading } = useBrandTheme();
  const { t } = useTranslation();

  useEffect(() => {
    // Wait for theme to load
    if (!loading && theme) {
      const siteName = theme.branding.siteName;
      const pageTitle = pageTitleKey ? t(pageTitleKey) : '';
      const finalTitle = pageTitle ? `${pageTitle} - ${siteName}` : siteName;

      // Update document title
      document.title = finalTitle;

      // Update all meta tags
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', theme.branding.siteDescription || siteName);
      }

      // Update Open Graph tags
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', finalTitle);
      }

      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) {
        ogDescription.setAttribute('content', theme.branding.siteDescription || siteName);
      }

      // Update Twitter tags
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      if (twitterTitle) {
        twitterTitle.setAttribute('content', finalTitle);
      }

      const twitterDescription = document.querySelector('meta[name="twitter:description"]');
      if (twitterDescription) {
        twitterDescription.setAttribute('content', theme.branding.siteDescription || siteName);
      }
    }
  }, [pageTitleKey, theme, loading, t]);
};
