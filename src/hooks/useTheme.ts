import { useState, useEffect } from 'react';

export interface ThemeConfig {
  name: string;
  displayName: string;
  description: string;
  version: string;
  colors: {
    primary: string;
    primaryDark: string;
    secondary: string;
    secondaryDark: string;
    success: string;
    warning: string;
    error: string;
    background: string;
    backgroundDark: string;
    surface: string;
    surfaceDark: string;
    text: string;
    textDark: string;
    textSecondary: string;
    textSecondaryDark: string;
    border: string;
    borderDark: string;
  };
  branding: {
    logo: string;
    favicon: string;
    companyName: string;
    siteName: string;
    siteDescription: string;
  };
  api: {
    baseUrl: string;
  };
  content: {
    welcomeMessage: string;
    footerText: string;
    contactEmail: string;
    supportEmail: string;
  };
}

const defaultTheme: ThemeConfig = {
  name: '506software',
  displayName: 'Shop 506',
  description: 'Online Store',
  version: '1.0.0',
  colors: {
    primary: '#3B82F6',
    primaryDark: '#1E40AF',
    secondary: '#6B7280',
    secondaryDark: '#374151',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    background: '#FFFFFF',
    backgroundDark: '#111827',
    surface: '#F9FAFB',
    surfaceDark: '#1F2937',
    text: '#111827',
    textDark: '#F9FAFB',
    textSecondary: '#6B7280',
    textSecondaryDark: '#9CA3AF',
    border: '#E5E7EB',
    borderDark: '#374151'
  },
  branding: {
    logo: '/logo-506.png',
    favicon: '/favicon-506.ico',
    companyName: '506 Software',
    siteName: 'Shop 506',
    siteDescription: 'Online Store'
  },
  api: {
    baseUrl: 'https://api.shop.506software.com'
  },
  content: {
    welcomeMessage: 'Welcome to Shop 506',
    footerText: '© 2024 506 Software. All rights reserved.',
    contactEmail: 'contact@506software.com',
    supportEmail: 'support@506software.com'
  }
};

export const useTheme = () => {
  const [theme, setTheme] = useState<ThemeConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const themeName = import.meta.env.VITE_THEME_NAME || '506software';
        console.log('Loading theme:', themeName);
        console.log('All env vars:', import.meta.env);
        const themeModule = await import(`@/config/themes/${themeName}.json`);
        console.log('Theme module loaded:', themeModule);
        setTheme(themeModule.default || defaultTheme);
      } catch (error) {
        console.error(`Failed to load theme: ${import.meta.env.VITE_THEME_NAME}`, error);
        setTheme(defaultTheme);
      } finally {
        setLoading(false);
      }
    };

    loadTheme();
  }, []);

  return { theme, loading };
};
