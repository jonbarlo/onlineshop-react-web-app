import { useEffect } from 'react';
import { getSiteTitle } from '@/config/app';

export const useDocumentTitle = (pageTitle?: string) => {
  useEffect(() => {
    document.title = getSiteTitle(pageTitle);
  }, [pageTitle]);
};
