import { app } from "@azure/functions";

// Adding to test slot swap

// Function to parse a Web-to-Lead form submission and extract the field values
app.http("WebToLeadFormParserService", {
  methods: ["POST"],
  authLevel: "function",
  handler: async (request, context) => {
    context.log("Web-to-Lead form parser request received.");

    try {
      if (!request.body) {
        throw new Error("Request body is missing or empty.");
      }

      const bodyJSON = await request.json();
      const inputData = bodyJSON;

      const outputData = {};
      // Iterate through the formdata array and extract the key-value pairs
      for (const item of inputData) {
        // Use regular expressions to extract field names dynamically
        const keyMatch = item.key.match(/^fields\[(.*?)\]\[value\]$/);
        if (keyMatch && keyMatch[1]) {
          const fieldName = keyMatch[1];
          outputData[fieldName] = item.value;
        }
      }

      // Add the web source to the output data
      outputData.webSource = "USEDMOBILITYSCOOTERSHOP.CO.UK";

      context.log("Web-to-Lead form submission successfully parsed");

      return {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(outputData),
        status: 200,
      };
    } catch (error) {
      context.log("Error parsing Web-to-Lead form submission:", error.message);

      return {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: `An error occurred processing the request: ${error.message}`,
        }),
        status: 500,
      };
    }
  },
});
