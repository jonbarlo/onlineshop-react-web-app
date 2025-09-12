#!/usr/bin/env tsx

import { execSync } from 'child_process';
import { existsSync, readFileSync, statSync, readdirSync } from 'fs';
import { join, relative } from 'path';
import { createReadStream, createWriteStream } from 'fs';
import { Client } from 'basic-ftp';

interface DeployOptions {
  environment?: string;
  skipBuild?: boolean;
  verbose?: boolean;
  dryRun?: boolean;
}

interface FTPConfig {
  host: string;
  user: string;
  password: string;
  port?: number;
  secure?: boolean;
  remotePath?: string;
}

interface EnvironmentConfig {
  VITE_API_BASE_URL?: string;
  FTP_HOST: string;
  FTP_USER: string;
  FTP_PASSWORD: string;
  FTP_PORT?: string;
  FTP_SECURE?: string;
  FTP_REMOTE_PATH?: string;
}

class FTPDeployManager {
  private projectRoot: string;
  private options: DeployOptions;
  private config: EnvironmentConfig | null = null;

  constructor(options: DeployOptions = {}) {
    this.projectRoot = process.cwd();
    this.options = {
      environment: 'production',
      skipBuild: false,
      verbose: false,
      dryRun: false,
      ...options
    };
  }

  private log(message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') {
    const colors = {
      info: '\x1b[36m',    // Cyan
      success: '\x1b[32m', // Green
      error: '\x1b[31m',   // Red
      warning: '\x1b[33m'  // Yellow
    };
    
    const reset = '\x1b[0m';
    const timestamp = new Date().toISOString().substr(11, 8);
    
    console.log(`${colors[type]}[${timestamp}] ${message}${reset}`);
  }

  private loadEnvironmentConfig(): boolean {
    this.log('🔍 Loading environment configuration...', 'info');

    // Require environment-specific file
    const envFile = `.env.${this.options.environment}`;
    if (!existsSync(join(this.projectRoot, envFile))) {
      this.log(`❌ Environment file not found: ${envFile}`, 'error');
      this.log('Please create a .env.production file with your FTP credentials and API settings.', 'warning');
      this.log('The deployment requires a production environment file to ensure proper configuration.', 'warning');
      return false;
    }

    try {
      const envContent = readFileSync(join(this.projectRoot, envFile), 'utf16le');
      const config: Partial<EnvironmentConfig> = {};

      envContent.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const equalIndex = trimmed.indexOf('=');
          if (equalIndex > 0) {
            const key = trimmed.substring(0, equalIndex).trim();
            const value = trimmed.substring(equalIndex + 1).trim();
            if (key && value) {
              (config as any)[key] = value;
            }
          }
        }
      });

      // Debug: Show what was parsed
      if (this.options.verbose) {
        this.log('Parsed environment variables:', 'info');
        Object.keys(config).forEach(key => {
          this.log(`  ${key}: ${(config as any)[key]}`, 'info');
        });
        this.log('Checking FTP credentials:', 'info');
        this.log(`  FTP_HOST exists: ${!!(config as any).FTP_HOST}`, 'info');
        this.log(`  FTP_USER exists: ${!!(config as any).FTP_USER}`, 'info');
        this.log(`  FTP_PASSWORD exists: ${!!(config as any).FTP_PASSWORD}`, 'info');
        this.log('Raw config object:', 'info');
        this.log(`  ${JSON.stringify(config)}`, 'info');
      }

      // Validate required FTP credentials
      const ftpHost = (config as any).FTP_HOST;
      const ftpUser = (config as any).FTP_USER;
      const ftpPassword = (config as any).FTP_PASSWORD;
      
      if (!ftpHost || !ftpUser || !ftpPassword) {
        this.log('❌ Missing FTP credentials in environment file', 'error');
        this.log('Required variables: FTP_HOST, FTP_USER, FTP_PASSWORD', 'warning');
        this.log('Optional variables: FTP_PORT, FTP_SECURE, FTP_REMOTE_PATH', 'warning');
        if (this.options.verbose) {
          this.log(`Found FTP_HOST: ${ftpHost || 'undefined'}`, 'info');
          this.log(`Found FTP_USER: ${ftpUser || 'undefined'}`, 'info');
          this.log(`Found FTP_PASSWORD: ${ftpPassword ? '[SET]' : '[NOT SET]'}`, 'info');
        }
        return false;
      }

      this.config = {
        VITE_API_BASE_URL: (config as any).VITE_API_BASE_URL,
        FTP_HOST: ftpHost,
        FTP_USER: ftpUser,
        FTP_PASSWORD: ftpPassword,
        FTP_PORT: (config as any).FTP_PORT,
        FTP_SECURE: (config as any).FTP_SECURE,
        FTP_REMOTE_PATH: (config as any).FTP_REMOTE_PATH,
      };

      this.log(`✅ Environment configuration loaded from ${envFile}`, 'success');
      return true;
    } catch (error: any) {
      this.log(`❌ Failed to load environment file: ${error.message}`, 'error');
      return false;
    }
  }

  private checkPrerequisites(): boolean {
    this.log('🔍 Checking prerequisites...', 'info');

    // Check if package.json exists
    if (!existsSync(join(this.projectRoot, 'package.json'))) {
      this.log('❌ package.json not found. Are you in the project root?', 'error');
      return false;
    }

    // Check if dist folder exists (unless skipping build)
    if (!this.options.skipBuild && !existsSync(join(this.projectRoot, 'dist'))) {
      this.log('⚠️  dist folder not found. Will build the project first.', 'warning');
    }

    this.log('✅ Prerequisites check passed', 'success');
    return true;
  }

  private buildProject(): boolean {
    if (this.options.skipBuild) {
      this.log('⏭️  Skipping build step', 'info');
      return true;
    }

    this.log('🏗️  Starting project build...', 'info');

    // Clean previous build
    if (existsSync(join(this.projectRoot, 'dist'))) {
      this.log('🧹 Cleaning previous build...', 'info');
      try {
        execSync('rmdir /s /q dist', { cwd: this.projectRoot, stdio: 'pipe' });
      } catch (error) {
        // Ignore errors, folder might not exist
      }
    }

    // Run TypeScript compilation and Vite build
    try {
      this.log('🔄 Building project...', 'info');
      
      if (this.options.verbose) {
        execSync('npm run build', { cwd: this.projectRoot, stdio: 'inherit' });
      } else {
        execSync('npm run build', { cwd: this.projectRoot, stdio: 'pipe' });
      }

      // Verify dist folder was created
      if (!existsSync(join(this.projectRoot, 'dist'))) {
        this.log('❌ Build completed but dist folder not found', 'error');
        return false;
      }

      this.log('✅ Project built successfully', 'success');
      return true;
    } catch (error: any) {
      this.log(`❌ Build failed: ${error.message}`, 'error');
      if (error.stdout) {
        this.log(`Output: ${error.stdout}`, 'error');
      }
      if (error.stderr) {
        this.log(`Error: ${error.stderr}`, 'error');
      }
      return false;
    }
  }

  private async uploadFile(client: Client, localPath: string, remotePath: string): Promise<boolean> {
    try {
      if (this.options.dryRun) {
        this.log(`[DRY RUN] Would upload: ${relative(this.projectRoot, localPath)} -> ${remotePath}`, 'info');
        return true;
      }

      await client.uploadFrom(localPath, remotePath);
      this.log(`✅ Uploaded: ${relative(this.projectRoot, localPath)}`, 'success');
      return true;
    } catch (error: any) {
      this.log(`❌ Failed to upload ${relative(this.projectRoot, localPath)}: ${error.message}`, 'error');
      return false;
    }
  }

  private async createDirectory(client: Client, remotePath: string): Promise<boolean> {
    try {
      if (this.options.dryRun) {
        this.log(`[DRY RUN] Would create directory: ${remotePath}`, 'info');
        return true;
      }

      // Just create the directory without changing to it
      await client.send(`MKD ${remotePath}`);
      this.log(`✅ Created directory: ${remotePath}`, 'success');
      return true;
    } catch (error: any) {
      // Directory might already exist, which is fine
      if (error.code === 550 || error.message.includes('already exists')) {
        this.log(`📁 Directory already exists: ${remotePath}`, 'info');
        return true;
      }
      this.log(`⚠️  Could not create directory ${remotePath}: ${error.message}`, 'warning');
      return true; // Continue anyway, might work for file uploads
    }
  }

  private async uploadDirectory(client: Client, localPath: string, remotePath: string = ''): Promise<boolean> {
    const items = readdirSync(localPath);
    
    for (const item of items) {
      if (!item.trim()) continue;
      
      const itemLocalPath = join(localPath, item);
      const itemRemotePath = remotePath ? `${remotePath}/${item}` : item;
      
      const stats = statSync(itemLocalPath);
      
      if (stats.isDirectory()) {
        // Create remote directory first
        this.log(`📁 Creating directory: ${itemRemotePath}`, 'info');
        await this.createDirectory(client, itemRemotePath);
        
        // Recursively upload subdirectory
        const success = await this.uploadDirectory(client, itemLocalPath, itemRemotePath);
        if (!success) return false;
      } else {
        // Upload file with full path
        const success = await this.uploadFile(client, itemLocalPath, itemRemotePath);
        if (!success) return false;
      }
    }
    
    return true;
  }

  private async deployProject(): Promise<boolean> {
    if (!this.config) {
      this.log('❌ Configuration not loaded', 'error');
      return false;
    }

    this.log('🚀 Starting FTP deployment...', 'info');
    this.log(`Target: ${this.config.FTP_HOST}:${this.config.FTP_PORT || 21}`, 'info');
    this.log(`User: ${this.config.FTP_USER}`, 'info');
    this.log(`Secure: ${this.config.FTP_SECURE}`, 'info');
    this.log(`Remote Path: ${this.config.FTP_REMOTE_PATH || '/'}`, 'info');

    const client = new Client();
    
    try {
      // Connect to FTP server
      this.log('🔌 Connecting to FTP server...', 'info');
      
      client.ftp.verbose = this.options.verbose;
      
      await client.access({
        host: this.config.FTP_HOST,
        user: this.config.FTP_USER,
        password: this.config.FTP_PASSWORD,
        port: this.config.FTP_PORT ? parseInt(this.config.FTP_PORT) : 21,
        secure: this.config.FTP_SECURE === 'true',
      });

      this.log('✅ Connected to FTP server', 'success');

      // Change to remote directory
      if (this.config.FTP_REMOTE_PATH && this.config.FTP_REMOTE_PATH !== '/') {
        this.log(`📁 Changing to remote directory: ${this.config.FTP_REMOTE_PATH}`, 'info');
        await client.cd(this.config.FTP_REMOTE_PATH);
      }

      // Upload dist directory
      const distPath = join(this.projectRoot, 'dist');
      if (!existsSync(distPath)) {
        this.log('❌ dist folder not found. Please run build first.', 'error');
        return false;
      }

      this.log('📤 Uploading dist directory...', 'info');
      const uploadSuccess = await this.uploadDirectory(client, distPath, '');
      
      if (!uploadSuccess) {
        this.log('❌ Failed to upload dist directory', 'error');
        return false;
      }

      // Upload web.config for IIS (if it exists)
      const webConfigPath = join(this.projectRoot, 'web.config');
      if (existsSync(webConfigPath)) {
        this.log('📤 Uploading web.config...', 'info');
        const webConfigSuccess = await this.uploadFile(client, webConfigPath, 'web.config');
        if (webConfigSuccess) {
          this.log('✅ Uploaded: web.config', 'success');
        }
      } else {
        this.log('⚠️  web.config not found - SPA routing might not work properly', 'warning');
        this.log('Consider creating a web.config file for IIS SPA support', 'warning');
      }

      // Upload production environment file as .env
      const envProductionPath = join(this.projectRoot, '.env.production');
      this.log('📤 Uploading .env.production as .env...', 'info');
      const envSuccess = await this.uploadFile(client, envProductionPath, '.env');
      if (envSuccess) {
        this.log('✅ Uploaded: .env.production as .env', 'success');
      } else {
        this.log('❌ Failed to upload .env.production', 'error');
        return false;
      }

      this.log('✅ FTP deployment completed successfully', 'success');
      return true;

    } catch (error: any) {
      this.log(`❌ FTP deployment failed: ${error.message}`, 'error');
      return false;
    } finally {
      client.close();
    }
  }

  public async deploy(): Promise<boolean> {
    const startTime = Date.now();

    this.log('🚀 Starting automated FTP deployment process...', 'info');
    this.log(`Environment: ${this.options.environment}`, 'info');
    this.log(`Skip Build: ${this.options.skipBuild}`, 'info');
    this.log(`Verbose: ${this.options.verbose}`, 'info');
    this.log(`Dry Run: ${this.options.dryRun}`, 'info');
    this.log('', 'info');

    try {
      // Step 1: Load environment configuration
      if (!this.loadEnvironmentConfig()) {
        return false;
      }

      // Step 2: Check prerequisites
      if (!this.checkPrerequisites()) {
        return false;
      }

      // Step 3: Build project
      if (!this.buildProject()) {
        return false;
      }

      // Step 4: Deploy project
      if (!await this.deployProject()) {
        return false;
      }

      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      this.log('', 'info');
      this.log('🎉 FTP deployment process completed successfully!', 'success');
      this.log(`⏱️  Total time: ${duration}s`, 'info');
      this.log('', 'info');
      this.log('Next steps:', 'info');
      this.log('1. Verify your files are uploaded to the server', 'info');
      this.log('2. Check that your app loads correctly in the browser', 'info');
      this.log('3. Test the routing (try navigating to /admin, /cart, etc.)', 'info');
      this.log('4. Test the API connection (check if products load)', 'info');
      this.log('5. Test admin login functionality', 'info');

      return true;
    } catch (error: any) {
      this.log(`❌ Deployment process failed: ${error.message}`, 'error');
      return false;
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const options: DeployOptions = {};

  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--environment':
      case '-e':
        options.environment = args[++i];
        break;
      case '--skip-build':
      case '-s':
        options.skipBuild = true;
        break;
      case '--verbose':
      case '-v':
        options.verbose = true;
        break;
      case '--dry-run':
      case '-d':
        options.dryRun = true;
        break;
      case '--help':
      case '-h':
        console.log(`
🚀 Online Shop FTP Deployment Script

Usage: npm run deploy:ftp [options]

Options:
  -e, --environment <env>    Deployment environment (default: production)
  -s, --skip-build          Skip the build step
  -v, --verbose             Show detailed output
  -d, --dry-run             Show what would be uploaded without actually uploading
  -h, --help                Show this help message

Examples:
  npm run deploy:ftp                    # Deploy to production
  npm run deploy:ftp -e staging         # Deploy to staging
  npm run deploy:ftp -s                 # Skip build, deploy existing dist
  npm run deploy:ftp -v                 # Verbose output
  npm run deploy:ftp -d                 # Dry run (show what would be uploaded)
  npm run deploy:ftp -e production -v   # Production with verbose output

Environment Files:
  .env.production    # Production environment variables (REQUIRED)
  .env.staging       # Staging environment variables (REQUIRED)
  .env.development   # Development environment variables (REQUIRED)

Required Environment Variables:
  FTP_HOST           # FTP server hostname
  FTP_USER           # FTP username
  FTP_PASSWORD       # FTP password

Optional Environment Variables:
  FTP_PORT           # FTP port (default: 21)
  FTP_SECURE         # Use FTPS (default: false)
  FTP_REMOTE_PATH    # Remote directory path (default: /)
  VITE_API_BASE_URL  # API base URL
        `);
        process.exit(0);
        break;
      default:
        if (arg.startsWith('-')) {
          console.error(`❌ Unknown option: ${arg}`);
          console.error('Use --help for usage information');
          process.exit(1);
        }
        break;
    }
  }

  const deployManager = new FTPDeployManager(options);
  const success = await deployManager.deploy();
  
  process.exit(success ? 0 : 1);
}

// Run the main function
main().catch((error) => {
  console.error('❌ Fatal error:', error.message);
  process.exit(1);
});

export { FTPDeployManager };
