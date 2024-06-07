import { app } from "@azure/functions";
import ACData from "adaptivecards-templating";

// Function to check if a string is a valid JSON
const isJson = (str) => {
  if (!str) {
    return false;
  }

  if (typeof str !== "string") {
    return true;
  }

  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

// Function to expand an Adaptive Card template using the data payload
app.http("AdaptiveCardTemplateExpansionService", {
  methods: ["POST"],
  authLevel: "function",
  handler: async (request, context) => {
    context.log("Adaptive Card template expansion request received.");

    try {
      const bodyJSON = await request.json();
      const templatePayload = bodyJSON.template;
      const dataPayload = bodyJSON.data;

      if (!templatePayload || !dataPayload) {
        throw new Error("Template or data payload is missing.");
      }

      if (!isJson(templatePayload) || !isJson(dataPayload)) {
        throw new Error("Template or data payload JSON is invalid.");
      }

      if (!templatePayload.version) {
        throw new Error("Template version is missing.");
      }

      if (!templatePayload.body) {
        throw new Error("Template body is missing.");
      }

      if (
        templatePayload.$schema !==
          "http://adaptivecards.io/schemas/adaptive-card.json" ||
        typeof templatePayload.$schema === undefined
      ) {
        throw new Error("Template $schema is missing or invalid.");
      }

      if (
        templatePayload.type !== "AdaptiveCard" ||
        typeof templatePayload.type === undefined
      ) {
        throw new Error("Template type is missing or invalid.");
      }

      // Expand the template using the data payload
      const template = new ACData.Template(templatePayload);
      const cardPayload = template.expand({ $root: dataPayload });

      if (
        !cardPayload ||
        !cardPayload.type ||
        cardPayload.type !== "AdaptiveCard"
      ) {
        throw new Error("An error occurred expanding the template.");
      }

      context.log("Successfully expanded Adaptive Card template.");

      const response = {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cardPayload),
        status: 200,
      };

      return response;
    } catch (error) {
      context.log(error.message);
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
