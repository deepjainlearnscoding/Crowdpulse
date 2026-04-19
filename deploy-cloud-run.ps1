# Cloud Run deployment helper for Promptwars
# Usage:
#   1. Open PowerShell in the project root
#   2. Set your Google Cloud project: $projectId = 'YOUR_PROJECT_ID'
#   3. Run this script: .\deploy-cloud-run.ps1

param(
    [Parameter(Mandatory=$true)]
    [string]$projectId,

    [string]$serviceName = 'promptwars',
    [string]$region = 'us-central1'
)

Write-Host "Starting Cloud Run deployment for project: $projectId" -ForegroundColor Cyan

# Authenticate if needed
Write-Host 'Ensuring gcloud authentication...' -ForegroundColor Yellow
& gcloud auth login --brief

Write-Host "Setting active project to $projectId" -ForegroundColor Yellow
& gcloud config set project $projectId

Write-Host 'Enabling Cloud Run APIs...' -ForegroundColor Yellow
& gcloud services enable run.googleapis.com --project $projectId

Write-Host "Deploying service $serviceName to Cloud Run in $region..." -ForegroundColor Yellow
& gcloud run deploy $serviceName `
    --source . `
    --platform managed `
    --region $region `
    --allow-unauthenticated `
    --project $projectId

Write-Host "Deployment complete. Check the service URL in the output." -ForegroundColor Green
