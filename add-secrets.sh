# Define secrets
secrets=(
  "AZURE_USERNAME=navpreet.singh@debutinfotech.com"
  "AZURE_PASSWORD=Welcome01@#$"
  "ACR_NAME=integrastriperegistry"
  "RESOURCE_GROUP=integra-stripe"
  "CONTAINER_APP_NAME=stripe-api"
  "IMAGE_NAME=striperegistry.azurecr.io/stripe-api"
)

# Loop through and add each secret
for secret in "${secrets[@]}"; do
  key="${secret%%=*}" # Extract secret name
  value="${secret#*=}" # Extract secret value
  gh secret set "$key" --body "$value" --repo harjotsingh19/integra-stripe-app
done
