RESOURCE_GROUP="integra-stripe-grp"
LOCATION="eastus"
ENVIRONMENT="integra-stripe-environment"
API_NAME="integra-stripe-api"
FRONTEND_NAME="integra-stripe-fe"

Docker_Image_API=hs60/payment-app-be:1.0.1


set -x

docker build -t $Docker_Image_API .

docker push $Docker_Image_API


docker-compose -f docker-compose.yaml up -d


docker logs stripe-payment-backend -f 




# az containerapp update --name $API_NAME --resource-group $RESOURCE_GROUP --image $Docker_Image_API --set-env-vars MONGO_URI=mongodb://stripe:stripe123%23@172.212.91.246:27017/integra-stripe


# az containerapp update --name $API_NAME --resource-group $RESOURCE_GROUP --image $Docker_Image_API


# set +x


# echo 
# echo
# echo

# az containerapp logs show --name $API_NAME --resource-group $RESOURCE_GROUP --follow