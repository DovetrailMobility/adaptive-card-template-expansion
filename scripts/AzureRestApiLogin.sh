#!/bin/bash

# script to login to Azure REST API and get the function invoke URL for a given slot

# declare variables
# CLIENT_ID: Azure AD Application ID
# CLIENT_SECRET: Azure AD Application Secret
# TENANT_ID: Azure AD Tenant ID
# RESOURCE: Azure REST API URL
# SUBSCRIPTION_ID: Azure Subscription ID
# RESOURCE_GROUP_NAME: Azure Resource Group Name
# FUNCTION_APP_NAME: Azure Function App Name
# SLOT_NAME: Azure Function App Slot Name
# FUNCTION_NAME: Azure Function Name

CLIENT_ID="a2cbfba5-bb03-4fc9-a507-d8ad73eb63a5"
CLIENT_SECRET=""
TENANT_ID="43c79093-c728-4f37-9833-832c46cd8b30"
RESOURCE="https://management.azure.com/"
SUBSCRIPTION_ID="7b8696fd-50de-4513-a35d-6ac33ed4292a"
RESOURCE_GROUP_NAME="w2l-prd-uks-rg"
FUNCTION_APP_NAME="w2l-prd-uks-fa"
SLOT_NAME="staging"
FUNCTION_NAME="ContactUsFormParserService"

# login to Azure REST API
BEARER_TOKEN=$(curl -X POST -d "grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&resource=${RESOURCE}" https://login.microsoftonline.com/${TENANT_ID}/oauth2/token --no-progress-meter)
ACCESS_TOKEN=$(echo $BEARER_TOKEN | jq -r '.access_token')

# call Azure REST API to get the function invoke URL
REST_API_URL=("https://management.azure.com/subscriptions/${SUBSCRIPTION_ID}/resourceGroups/${RESOURCE_GROUP_NAME}/providers/Microsoft.Web/sites/${FUNCTION_APP_NAME}/slots/${SLOT_NAME}/functions/${FUNCTION_NAME}?api-version=2023-12-01")
FUNCTION_INVOKE_URL=$(curl -X GET -H "Authorization: Bearer ${ACCESS_TOKEN}" -H "Content-Type: application/json" ${REST_API_URL} --no-progress-meter | jq -r '.properties.invoke_url_template')

echo "Function Invoke URL: ${FUNCTION_INVOKE_URL}"