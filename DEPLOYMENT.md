# Online Shop React App - Deployment Guide

## Overview
This guide will help you deploy your Online Shop React app to production using IIS shared hosting.

## Prerequisites
- Node.js and npm installed
- FTP access to your hosting provider
- Production API server running

## Step 1: Prepare Environment Configuration

1. **Copy the environment template:**
   ```bash
   cp env.production.example .env.production
   ```

2. **Edit `.env.production` with your actual values:**
   ```env
   # API Configuration
   VITE_API_BASE_URL=https://api.shop.506software.com
   
   # App Configuration
   VITE_APP_NAME=Shop 506
   VITE_APP_VERSION=1.0.0
   
   # FTP Deployment Credentials
   FTP_HOST=your-ftp-server.com
   FTP_USER=your-username
   FTP_PASSWORD=your-password
   FTP_PORT=21
   FTP_SECURE=false
   FTP_REMOTE_PATH=/
   ```

## Step 2: Build the Application

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build for production:**
   ```bash
   npm run build
   ```

   This will create a `dist` folder with all the production files.

## Step 3: Deploy to Production

1. **Run the deployment script:**
   ```powershell
   .\deploy-shop.ps1
   ```

   Or specify a different environment:
   ```powershell
   .\deploy-shop.ps1 -Environment production
   ```

## Step 4: Verify Deployment

After deployment, check:

1. **App loads correctly** - Visit your domain
2. **Routing works** - Try navigating to `/admin`, `/cart`, etc.
3. **API connection** - Check if products load from the API
4. **Admin login** - Test the admin login functionality
5. **Image uploads** - Test product image uploads

## Troubleshooting

### Common Issues

1. **404 errors on page refresh:**
   - Ensure `web.config` is uploaded
   - Check IIS URL rewrite module is installed

2. **API connection issues:**
   - Verify `VITE_API_BASE_URL` in `.env.production`
   - Check CORS settings on your API server

3. **Images not loading:**
   - Check image upload endpoint is working
   - Verify CORS settings for image URLs

4. **Admin login not working:**
   - Check API authentication endpoint
   - Verify JWT token handling

### File Structure After Deployment

Your server should have:
```
/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [other assets]
├── web.config
└── .env (optional)
```

## Environment Variables

### Required for Build
- `VITE_API_BASE_URL` - Your production API URL

### Required for Deployment
- `FTP_HOST` - Your FTP server hostname
- `FTP_USER` - Your FTP username
- `FTP_PASSWORD` - Your FTP password

### Optional
- `FTP_PORT` - FTP port (default: 21)
- `FTP_SECURE` - Use FTPS (default: false)
- `FTP_REMOTE_PATH` - Remote directory path (default: /)

## Security Notes

- Never commit `.env.production` to version control
- Use strong FTP passwords
- Enable HTTPS on your production domain
- Regularly update dependencies

## Support

If you encounter issues:
1. Check the deployment logs
2. Verify FTP credentials
3. Test API endpoints manually
4. Check browser console for errors
