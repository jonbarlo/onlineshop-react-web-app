// Image optimization utilities

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'auto' | 'original';
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  blur?: number;
  sharpen?: number;
}

/**
 * Generate optimized image URL with CDN parameters
 * This is a placeholder - replace with your actual CDN service
 */
export const getOptimizedImageUrl = (
  originalUrl: string,
  _options: ImageOptimizationOptions = {}
): string => {
  if (!originalUrl || originalUrl.startsWith('data:')) {
    return originalUrl;
  }

  // For now, return original URL
  // In production, you would integrate with a CDN service
  // and use the options parameter for optimization

  // For now, return original URL
  // In production, you would integrate with a CDN like:
  // - Cloudinary
  // - ImageKit
  // - Cloudflare Images
  // - AWS CloudFront with Lambda@Edge
  
  // Example Cloudinary URL:
  // return `https://res.cloudinary.com/your-cloud/image/fetch/w_${width},h_${height},q_${quality},f_${format}/${encodeURIComponent(originalUrl)}`;
  
  // Example ImageKit URL:
  // return `https://ik.imagekit.io/your-id/tr:w-${width},h-${height},q-${quality},f-${format}/${originalUrl}`;

  return originalUrl;
};

/**
 * Generate responsive image srcset
 */
export const generateSrcSet = (
  originalUrl: string,
  sizes: number[] = [320, 640, 768, 1024, 1280, 1536]
): string => {
  return sizes
    .map(size => `${getOptimizedImageUrl(originalUrl, { width: size })} ${size}w`)
    .join(', ');
};

/**
 * Check if browser supports WebP
 */
export const supportsWebP = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      resolve(false);
      return;
    }

    const dataURL = canvas.toDataURL('image/webp');
    resolve(dataURL.indexOf('data:image/webp') === 0);
  });
};

/**
 * Check if browser supports AVIF
 */
export const supportsAVIF = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      resolve(false);
      return;
    }

    const dataURL = canvas.toDataURL('image/avif');
    resolve(dataURL.indexOf('data:image/avif') === 0);
  });
};

/**
 * Get best image format for current browser
 */
export const getBestImageFormat = async (): Promise<'avif' | 'webp' | 'original'> => {
  if (await supportsAVIF()) return 'avif';
  if (await supportsWebP()) return 'webp';
  return 'original';
};

/**
 * Generate blur placeholder for progressive loading
 */
export const generateBlurPlaceholder = (width: number = 300, height: number = 300): string => {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" font-family="Arial" font-size="14" fill="#99a3af" text-anchor="middle" dy=".3em">Loading...</text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};
