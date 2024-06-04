#!/bin/bash

# script to login to Azure REST API and get the function invoke URL for a given slot

# declare variables
# RESOURCE_GROUP_NAME: Azure Resource Group Name
# FUNCTION_APP_NAME: Azure Function App Name
# SLOT_NAME: Azure Function App Slot Name
# FUNCTION_NAME: Azure Function Name
RESOURCE_GROUP_NAME="w2l-prd-uks-rg"
FUNCTION_APP_NAME="w2l-prd-uks-fa"
SLOT_NAME="staging"
FUNCTION_NAME="ContactUsFormParserService"

# login to Azure REST API
ACCESS_TOKEN=$(az account get-access-token --query "accessToken" -o tsv)
RESOURCE="https://management.azure.com/"
SUBSCRIPTION_ID=$(az account show --query "id" -o tsv)

# call Azure REST API to get the function invoke URL base
REST_API_URL=$(echo "https://management.azure.com/subscriptions/${SUBSCRIPTION_ID}/resourceGroups/${RESOURCE_GROUP_NAME}/providers/Microsoft.Web/sites/${FUNCTION_APP_NAME}/slots/${SLOT_NAME}/functions/${FUNCTION_NAME}?api-version=2023-12-01")
INVOKE_URL_BASE=$(curl -X GET -H "Authorization: Bearer ${ACCESS_TOKEN}" -H "Content-Type: application/json" ${REST_API_URL} --no-progress-meter | jq -r '.properties.invoke_url_template')

# call Azure REST API to get the function invoke URL key
REST_API_URL=$(echo "https://management.azure.com/subscriptions/${SUBSCRIPTION_ID}/resourceGroups/${RESOURCE_GROUP_NAME}/providers/Microsoft.Web/sites/${FUNCTION_APP_NAME}/slots/${SLOT_NAME}/functions/${FUNCTION_NAME}/listKeys?api-version=2023-12-01")
INVOKE_URL_KEY=$(curl -X POST -H "Authorization: Bearer ${ACCESS_TOKEN}" -H "Content-Type: application/json" -H "content-length: 0" ${REST_API_URL} --no-progress-meter | jq -r '.default')

# construct the function invoke URL
FUNCTION_INVOKE_URL=$(echo "${INVOKE_URL_BASE}?code=${INVOKE_URL_KEY}")

echo "Function Invoke URL: ${FUNCTION_INVOKE_URL}"