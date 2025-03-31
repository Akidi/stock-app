# setup.ps1 - Automates SvelteKit project setup for dev and prod

# At the top of setup.ps1, after $dbName
param([string]$AppName = "app-boilerplate")

# Update Docker Compose files
$composeFiles = @("./docker-compose.yml", "./docker-compose.prod.yml")
foreach ($file in $composeFiles) {
    (Get-Content $file) -replace "app-boilerplate", $AppName | Set-Content $file
}

$dbName = "$AppName.db"
# Function to generate a random password
function New-RandomPassword {
    param (
        [int]$Length,
        [string[]]$CharSet
    )
    return -join ($CharSet | Get-Random -Count $Length)
}

# Define character sets
$devCharSet = ('a'..'z') + ('A'..'Z') + ('0'..'9')  # a-zA-Z0-9 (62 chars)
$prodCharSet = ('a'..'z') + ('A'..'Z') + ('0'..'9') + @('-', '_')  # a-zA-Z0-9-_ (64 chars)

# Define users and their roles
$users = @(
    @{ Name = "app_admin"; Role = "admin" },
    @{ Name = "app_developer"; Role = "developer" },
    @{ Name = "app_api"; Role = "api" },
    @{ Name = "app_readonly"; Role = "read_only" },
    @{ Name = "app_backup"; Role = "backup" },
    @{ Name = "app_auditor"; Role = "auditor" }
)

# Store generated passwords (separate for dev and prod)
$devPasswords = @{}
$prodPasswords = @{}

# Generate passwords (dev: 8 chars, prod: 32 chars)
foreach ($user in $users) {
    $devPasswords[$user.Name] = New-RandomPassword -Length 8 -CharSet $devCharSet
    $prodPasswords[$user.Name] = New-RandomPassword -Length 32 -CharSet $prodCharSet
}

# Copy example files
Copy-Item -Path "./db/init.dev.example.sql" -Destination "./db/init.dev.sql" -Force
Copy-Item -Path "./db/init.prod.example.sql" -Destination "./db/init.prod.sql" -Force
Copy-Item -Path "./.env.dev.example" -Destination "./.env.dev" -Force
Copy-Item -Path "./.env.prod.example" -Destination "./.env.prod" -Force
Copy-Item -Path "./app/.env.example" -Destination "./app/.env" -Force

# Update init.dev.sql with dev passwords
$initDevContent = Get-Content -Path "./db/init.dev.sql" -Raw
foreach ($user in $users) {
    $initDevContent = $initDevContent -replace "CREATE ROLE $($user.Name) LOGIN PASSWORD '[^']*'", "CREATE ROLE $($user.Name) LOGIN PASSWORD '$($devPasswords[$user.Name])'"
}
Set-Content -Path "./db/init.dev.sql" -Value $initDevContent

# Update init.prod.sql with prod passwords
$initProdContent = Get-Content -Path "./db/init.prod.sql" -Raw
foreach ($user in $users) {
    $initProdContent = $initProdContent -replace "CREATE ROLE $($user.Name) LOGIN PASSWORD '[^']*'", "CREATE ROLE $($user.Name) LOGIN PASSWORD '$($prodPasswords[$user.Name])'"
}
Set-Content -Path "./db/init.prod.sql" -Value $initProdContent

# Update .env.dev with dev connection string (using app_admin)
$envDevContent = Get-Content -Path "./.env.dev" -Raw
$envDevContent = $envDevContent -replace "DATABASE_URL=.*", "DATABASE_URL=postgresql://app_admin:$($devPasswords['app_admin'])@$($dbName).dev:5432/webapp_dev"
Set-Content -Path "./.env.dev" -Value $envDevContent

# Update ./app/.env with dev connection strings (app_admin, app_api, app_readonly)
$envAppContent = Get-Content -Path "./app/.env" -Raw
$envAppContent = $envAppContent -replace "DATABASE_URL=.*", "DATABASE_URL=postgresql://app_admin:$($devPasswords['app_admin'])@$($dbName).dev:5432/webapp_dev"
$envAppContent = $envAppContent -replace "WRITE_DATABASE_URL=.*", "WRITE_DATABASE_URL=postgresql://app_api:$($devPasswords['app_api'])@$($dbName).dev:5432/webapp_dev"
$envAppContent = $envAppContent -replace "READ_DATABASE_URL=.*", "READ_DATABASE_URL=postgresql://app_readonly:$($devPasswords['app_readonly'])@$($dbName).dev:5432/webapp_dev"
$envAppContent = $envAppContent -replace "REDIS_URL=.*",
"REDIS_URL=redis://${AppName}.redis.dev:6379"
Set-Content -Path "./app/.env" -Value $envAppContent

# Update .env.prod with prod connection strings (app_admin, app_api, app_readonly)
$envProdContent = Get-Content -Path "./.env.prod" -Raw
$envProdContent = $envProdContent -replace "DATABASE_URL=.*", "DATABASE_URL=postgresql://app_admin:$($prodPasswords['app_admin'])@$($dbName).prod:5432/webapp"
$envProdContent = $envProdContent -replace "WRITE_DATABASE_URL=.*", "WRITE_DATABASE_URL=postgresql://app_api:$($prodPasswords['app_api'])@$($dbName).prod:5432/webapp"
$envProdContent = $envProdContent -replace "READ_DATABASE_URL=.*", "READ_DATABASE_URL=postgresql://app_readonly:$($prodPasswords['app_readonly'])@$($dbName).prod:5432/webapp"
$envProdContent = $envProdContent -replace "REDIS_URL=.*",
"REDIS_URL=redis://${AppName}.redis.prod:6379"
Set-Content -Path "./.env.prod" -Value $envProdContent

# Display generated passwords
Write-Host "Development Passwords (8 chars):" -ForegroundColor Green
foreach ($user in $users) {
    Write-Host "$($user.Name): $($devPasswords[$user.Name])" -ForegroundColor Yellow
}
Write-Host "`nProduction Passwords (32 chars):" -ForegroundColor Green
foreach ($user in $users) {
    Write-Host "$($user.Name): $($prodPasswords[$user.Name])" -ForegroundColor Yellow
}

Write-Host "`nSetup complete! Run the following to start:" -ForegroundColor Green
Write-Host "Development: docker-compose up --build -d" -ForegroundColor Cyan
Write-Host "Production: docker-compose -f docker-compose.prod.yml up --build -d" -ForegroundColor Cyan