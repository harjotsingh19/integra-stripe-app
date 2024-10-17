RESOURCE_GROUP="integra-stripe-grp"
LOCATION="eastus"
ENVIRONMENT="integra-stripe-environment"
API_NAME="stripe-api"
FRONTEND_NAME="stripe-fe"
ACR_NAME="IntegraStripeRegistry"
Docker_Image_API=hs60/payment-app-be:latest
Docker_Image_FE=hs60/payment-app-fe:latest


set -x

docker build --no-cache -t $Docker_Image_API .

docker push $Docker_Image_API


docker pull $Docker_Image_API

# az containerapp revision list --name $API_NAME --resource-group $RESOURCE_GROUP


# az containerapp update --name $API_NAME --resource-group $RESOURCE_GROUP --image $Docker_Image_API --set-env-vars MONGO_URI=mongodb://stripe:stripe123%23@172.212.91.246:27017/integra-stripe


# az containerapp update --name $API_NAME --resource-group $RESOURCE_GROUP --image $Docker_Image_API


sleep 10

az containerapp delete --name $API_NAME --resource-group $RESOURCE_GROUP --yes

az containerapp create --name $API_NAME --resource-group $RESOURCE_GROUP --environment $ENVIRONMENT --image $Docker_Image_API --target-port 3001 --ingress external
set +x


echo 
echo
echo

az containerapp logs show --name $API_NAME --resource-group $RESOURCE_GROUP --follow