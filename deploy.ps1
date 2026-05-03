# Deployment Script for Cloud Run
$gcloud = "C:\Users\yashs\.android\election-assistant\google-cloud-sdk\bin\gcloud.cmd"

Write-Host "Logging into Google Cloud..."
& $gcloud auth login

Write-Host "Setting project to gen-lang-client-0839003229..."
& $gcloud config set project gen-lang-client-0839003229

Write-Host "Deploying to Cloud Run..."
& $gcloud run deploy voteassist --source . --region us-central1 --allow-unauthenticated

Write-Host "Deployment complete!"
