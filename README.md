# Adaptive Card Template Expansion Service
Azure Function to expand Adaptive Card Templates

## Usage
### Request
```json
{
    "template": {
        "type": "AdaptiveCard",
        "body": [
            {
                "type": "TextBlock",
                "text": "Hello, {{name}}!"
            }
        ]
    },
    "data": {
        "name": "World"
    }
}
```

### Response
```json
{
    "type": "AdaptiveCard",
    "body": [
        {
            "type": "TextBlock",
            "text": "Hello, World!"
        }
    ]
}
```

## Development
### Prerequisites
- [Docker](https://www.docker.com/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Visual Studio Code Extension: Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

### Steps
1. Clone this repository
2. Open the repository in Visual Studio Code
3. Open the command palette in Visual Studio Code
4. Select `Remote-Containers: Reopen in Container`
5. Open the terminal in Visual Studio Code
6. Restore the dependencies
    ```bash
    npm install
    ```
7. Run the function app
    ```bash
    func start
    ```
8. Copy the function URL from the output
9. Create a new file in the repository called `test.json` with the following content:
    ```json
    {
        "template": {
            "type": "AdaptiveCard",
            "body": [
                {
                    "type": "TextBlock",
                    "text": "Hello, {{name}}!"
                }
            ]
        },
        "data": {
            "name": "World"
        }
    }
    ```
10. Replace `<function-url>` with the function URL copied in step 8
11. Replace `<function-key>` with the function key copied in step 8
12. Replace `<template>` with the content of `test.json`
13. Send a POST request to `<function-url>?code=<function-key>` with the content of `test.json` as the body
14. The response should be:
    ```json
    {
        "type": "AdaptiveCard",
        "body": [
            {
                "type": "TextBlock",
                "text": "Hello, World!"
            }
        ]
    }
    ```

## Testing
### Prerequisites
- [Docker](https://www.docker.com/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Visual Studio Code Extension: Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
- [Mocha](https://mochajs.org/)

### Steps
1. Clone this repository
2. Open the repository in Visual Studio Code
3. Open the command palette in Visual Studio Code
4. Select `Remote-Containers: Reopen in Container`
5. Open the terminal in Visual Studio Code
6. Restore the dependencies
    ```bash
    npm install
    ```
7. Run the tests
    ```bash
    npm test
    ```

## Deployment
### Prerequisites
- [Docker](https://www.docker.com/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Visual Studio Code Extension: Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

### Steps
1. Clone this repository
2. Open the repository in Visual Studio Code
3. Open the command palette in Visual Studio Code
4. Select `Remote-Containers: Reopen in Container`
5. Open the terminal in Visual Studio Code
6. Login to Azure CLI
    ```bash
    az login
    ```
7. Create a resource group
    ```bash
    az group create --name <resource-group-name> --location <location>
    ```
8. Create a storage account
    ```bash
    az storage account create --name <storage-account-name> --location <location> --resource-group <resource-group-name> --sku Standard_LRS
    ```
9. Create a function app
    ```bash
    az functionapp create --resource-group <resource-group-name> --consumption-plan-location <location> --runtime dotnet --functions-version 3 --name <function-app-name> --storage-account <storage-account-name>
    ```
10. Deploy the function app
    ```bash
    func azure functionapp publish <function-app-name>
    ```
11. Copy the function app URL from the output
12. Create a new file in the repository called `local.settings.json` with the following content:
    ```json
    {
        "IsEncrypted": false,
        "Values": {
            "AzureWebJobsStorage": "<storage-account-connection-string>",
            "FUNCTIONS_WORKER_RUNTIME": "dotnet"
        }
    }
    ```
13. Replace `<storage-account-connection-string>` with the connection string of the storage account created in step 8
14. Open the command palette in Visual Studio Code
15. Select `Azure Functions: Open in portal`
16. Select the function app created in step 9
17. Select `Functions`
18. Select `ExpandTemplate`
19. Select `Get function URL`
20. Copy the function URL
21. Create a new file in the repository called `test.json` with the following content:
    ```json
    {
        "template": {
            "type": "AdaptiveCard",
            "body": [
                {
                    "type": "TextBlock",
                    "text": "Hello, {{name}}!"
                }
            ]
        },
        "data": {
            "name": "World"
        }
    }
    ```
22. Replace `<function-url>` with the function URL copied in step 20
23. Replace `<function-key>` with the function key copied in step 20
24. Replace `<template>` with the content of `test.json`
25. Send a POST request to `<function-url>?code=<function-key>` with the content of `test.json` as the body
26. The response should be:
    ```json
    {
        "type": "AdaptiveCard",
        "body": [
            {
                "type": "TextBlock",
                "text": "Hello, World!"
            }
        ]
    }
    ```
27. Commit and push the changes to the repository
28. Open the command palette in Visual Studio Code
29. Select `Azure Functions: Deploy to function app`
30. Select the function app created in step 9
31. Select `ExpandTemplate`
32. Select `Deploy to function app`

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](LICENSE)


