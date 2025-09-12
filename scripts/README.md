# 🚀 Deployment Scripts

This directory contains automated deployment scripts for the Online Shop React Web App.

## 📋 Overview

The deployment system provides a streamlined way to build and deploy your React application to your hosting server via FTP.

## 🛠️ Available Scripts

### Main Deployment Commands

```bash
# Deploy to production (default)
npm run deploy

# Deploy to staging environment
npm run deploy:staging

# Deploy to production environment explicitly
npm run deploy:production

# Quick deploy (skip build, use existing dist folder)
npm run deploy:quick
```

### Command Line Options

```bash
# Basic usage
npm run deploy

# With options
npm run deploy -- --environment staging --verbose
npm run deploy -- --skip-build
npm run deploy -- --help
```

#### Available Options:

- `-e, --environment <env>` - Deployment environment (default: production)
- `-s, --skip-build` - Skip the build step
- `-v, --verbose` - Show detailed output
- `-h, --help` - Show help message

## 📁 Environment Files

The deployment script looks for environment-specific configuration files:

- `.env.production` - Production environment variables
- `.env.staging` - Staging environment variables  
- `.env` - Default environment variables (fallback)

### Required Environment Variables

```env
# API Configuration
VITE_API_BASE_URL=https://api.yourserver.com

# FTP Deployment Credentials
FTP_HOST=your-ftp-server.com
FTP_USER=your-username
FTP_PASSWORD=your-password
FTP_PORT=21
FTP_SECURE=false
FTP_REMOTE_PATH=/
```

## 🔄 Deployment Process

The automated deployment process includes:

1. **Prerequisites Check**
   - Verifies package.json exists
   - Checks for deploy-shop.ps1 script
   - Validates environment file

2. **Build Process**
   - Cleans previous dist folder
   - Runs TypeScript compilation
   - Executes Vite build
   - Verifies build output

3. **Deployment Process**
   - Executes PowerShell deployment script
   - Uploads files via FTP
   - Provides deployment status

## 📊 Output Examples

### Successful Deployment
```
🚀 Starting automated deployment process...
Environment: production
Skip Build: false
Verbose: false

🔍 Checking prerequisites...
✅ Prerequisites check passed

🏗️ Starting project build...
🔄 Building project...
✅ Project built successfully

🚀 Starting deployment...
🔄 Deploying to server...
✅ Deployment completed successfully

🎉 Deployment process completed successfully!
⏱️ Total time: 45.2s

Next steps:
1. Verify your files are uploaded to the server
2. Check that your app loads correctly in the browser
3. Test the routing (try navigating to /admin, /cart, etc.)
4. Test the API connection (check if products load)
5. Test admin login functionality
```

### Error Handling
```
❌ Build failed. Please fix the errors and try again.
❌ Deployment failed
❌ Deployment process failed: [error message]
```

## 🛡️ Error Handling

The deployment script includes comprehensive error handling:

- **Build Errors**: Stops deployment if TypeScript compilation fails
- **Missing Files**: Validates required files exist before deployment
- **FTP Errors**: Provides detailed error messages for connection issues
- **Environment Issues**: Checks for required environment variables

## 🔧 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Fix TypeScript errors first
   npm run type-check
   npm run build
   ```

2. **Missing Environment File**
   ```bash
   # Copy example and configure
   cp env.production.example .env.production
   # Edit .env.production with your credentials
   ```

3. **FTP Connection Issues**
   - Verify FTP credentials in environment file
   - Check firewall settings
   - Ensure FTP server is accessible

4. **PowerShell Execution Policy**
   ```bash
   # If you get execution policy errors
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

## 📝 Customization

### Adding New Environments

1. Create environment file: `.env.your-env`
2. Deploy with: `npm run deploy -- --environment your-env`

### Modifying Build Process

Edit `scripts/deploy.ts` to customize:
- Build commands
- File validation
- Error handling
- Output formatting

## 🔗 Related Files

- `deploy-shop.ps1` - PowerShell FTP deployment script
- `env.production.example` - Environment file template
- `web.config` - IIS configuration for SPA routing

## 📞 Support

For deployment issues:
1. Check the verbose output: `npm run deploy -- --verbose`
2. Verify environment configuration
3. Test FTP connection manually
4. Check server logs for errors
