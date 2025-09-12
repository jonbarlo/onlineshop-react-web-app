# Online Shop ReactJS Web App - IIS Deployment Script
# This script uploads the built React app to your IIS shared hosting via FTP

param(
    [string]$Environment = "production"
)

Write-Host "Online Shop ReactJS Web App - IIS Deployment" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Check if dist folder exists
if (-not (Test-Path "dist")) {
    Write-Host "Error: dist folder not found!" -ForegroundColor Red
    Write-Host "Please run 'npm run build' first to build the application." -ForegroundColor Yellow
    exit 1
}

# Load environment variables
$envFile = ".env.$Environment"

if (-not (Test-Path $envFile)) {
    Write-Host "Error: Environment file .env.$Environment not found!" -ForegroundColor Red
    Write-Host "Please create a .env.production file with your FTP credentials and API settings." -ForegroundColor Yellow
    Write-Host "The deployment requires a production environment file to ensure proper configuration." -ForegroundColor Yellow
    exit 1
}

# Read environment variables
Get-Content $envFile | ForEach-Object {
    if ($_ -match '^([^=]+)=(.*)$') {
        $name = $matches[1]
        $value = $matches[2]
        Set-Variable -Name $name -Value $value -Scope Script
    }
}

# Check required FTP credentials
if (-not $FTP_HOST -or -not $FTP_USER -or -not $FTP_PASSWORD) {
    Write-Host "Error: Missing FTP credentials in $envFile" -ForegroundColor Red
    Write-Host "Required variables: FTP_HOST, FTP_USER, FTP_PASSWORD" -ForegroundColor Yellow
    Write-Host "Optional variables: FTP_PORT, FTP_SECURE, FTP_REMOTE_PATH" -ForegroundColor Yellow
    exit 1
}

# Check API configuration
if (-not $VITE_API_BASE_URL) {
    Write-Host "Warning: VITE_API_BASE_URL not set in $envFile" -ForegroundColor Yellow
    Write-Host "Your app will use the default API URL from the build" -ForegroundColor Yellow
}

# Build FTP URI with port and secure settings
$ftpScheme = if ($FTP_SECURE -eq "true") { "ftps" } else { "ftp" }
$ftpUri = "$ftpScheme`://$FTP_HOST"
if ($FTP_PORT -and $FTP_PORT -ne "21") {
    $ftpUri += ":${FTP_PORT}"
}
if ($FTP_REMOTE_PATH -and $FTP_REMOTE_PATH -ne "/") {
    $ftpUri += $FTP_REMOTE_PATH
}

Write-Host "Source: dist/" -ForegroundColor Cyan
Write-Host "Target: $ftpUri" -ForegroundColor Cyan
Write-Host "User: $FTP_USER" -ForegroundColor Cyan
Write-Host "Secure: $FTP_SECURE" -ForegroundColor Cyan
Write-Host "Port: $FTP_PORT" -ForegroundColor Cyan
Write-Host "API URL: $VITE_API_BASE_URL" -ForegroundColor Cyan

# Create FTP credentials
$ftpCredentials = New-Object System.Net.NetworkCredential($FTP_USER, $FTP_PASSWORD)

# Function to upload file
function Upload-File {
    param(
        [string]$LocalPath,
        [string]$RemotePath
    )
    
    try {
        $ftpRequest = [System.Net.FtpWebRequest]::Create("$ftpUri/$RemotePath")
        $ftpRequest.Credentials = $ftpCredentials
        $ftpRequest.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
        $ftpRequest.UsePassive = $true
        $ftpRequest.UseBinary = $true
        $ftpRequest.KeepAlive = $false
        
        $fileStream = [System.IO.File]::OpenRead($LocalPath)
        $ftpStream = $ftpRequest.GetRequestStream()
        
        $buffer = New-Object byte[] 8192
        $read = 0
        
        do {
            $read = $fileStream.Read($buffer, 0, $buffer.Length)
            $ftpStream.Write($buffer, 0, $read)
        } while ($read -gt 0)
        
        $ftpStream.Close()
        $fileStream.Close()
        
        Write-Host "Uploaded: $RemotePath" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "Failed to upload ${RemotePath}: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Function to create directory
function Create-Directory {
    param([string]$RemotePath)
    
    try {
        $ftpRequest = [System.Net.FtpWebRequest]::Create("$ftpUri/$RemotePath")
        $ftpRequest.Credentials = $ftpCredentials
        $ftpRequest.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
        $ftpRequest.UsePassive = $true
        
        $response = $ftpRequest.GetResponse()
        $response.Close()
        
        Write-Host "Created directory: $RemotePath" -ForegroundColor Cyan
        return $true
    }
    catch {
        # Directory might already exist, which is fine
        return $true
    }
}

# Function to upload directory recursively
function Upload-Directory {
    param(
        [string]$LocalPath,
        [string]$RemotePath = ""
    )
    
    # Create remote directory if needed
    if ($RemotePath -and $RemotePath -ne "") {
        Create-Directory -RemotePath $RemotePath
    }
    
    # Get all files and subdirectories
    $items = Get-ChildItem -Path $LocalPath
    
    foreach ($item in $items) {
        $itemRemotePath = if ($RemotePath) { "$RemotePath/$($item.Name)" } else { $item.Name }
        
        if ($item.PSIsContainer) {
            # Recursively upload subdirectory
            Upload-Directory -LocalPath $item.FullName -RemotePath $itemRemotePath
        } else {
            # Upload file
            Upload-File -LocalPath $item.FullName -RemotePath $itemRemotePath
        }
    }
}

# Start deployment
Write-Host "Starting deployment..." -ForegroundColor Yellow
$startTime = Get-Date

# Upload the entire dist directory
Upload-Directory -LocalPath "dist"

# Upload web.config for IIS (if it exists)
if (Test-Path "web.config") {
    Upload-File -LocalPath "web.config" -RemotePath "web.config"
    Write-Host "Uploaded: web.config" -ForegroundColor Green
} else {
    Write-Host "Warning: web.config not found - SPA routing might not work properly" -ForegroundColor Yellow
    Write-Host "Consider creating a web.config file for IIS SPA support" -ForegroundColor Yellow
}

# Upload production environment file as .env
Upload-File -LocalPath ".env.production" -RemotePath ".env"
Write-Host "Uploaded: .env.production as .env" -ForegroundColor Green

$endTime = Get-Date
$duration = $endTime - $startTime

Write-Host "Deployment completed!" -ForegroundColor Green
Write-Host "Duration: $($duration.TotalSeconds.ToString('F1')) seconds" -ForegroundColor Cyan
Write-Host "Your online shop should now be available at: $ftpUri" -ForegroundColor Cyan

Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Verify your files are uploaded to the server" -ForegroundColor White
Write-Host "2. Check that your app loads correctly in the browser" -ForegroundColor White
Write-Host "3. Test the routing (try navigating to /admin, /cart, etc.)" -ForegroundColor White
Write-Host "4. Test the API connection (check if products load)" -ForegroundColor White
Write-Host "5. Test admin login functionality" -ForegroundColor White
Write-Host "6. If routing does not work, ensure web.config is properly configured" -ForegroundColor White
