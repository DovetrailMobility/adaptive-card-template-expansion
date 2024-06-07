import { app } from "@azure/functions";

// Function to parse a Contact Us form submission and extract the field values

app.http("ContactUsFormParserService", {
  methods: ["POST"],
  authLevel: "function",
  handler: async (request, context) => {
    context.log("Contact us form submissions request received.");

    // Function to transform the list of form data into an object
    function transformListToObject(dataList) {
      const transformedObject = {};
      dataList.forEach((item) => {
        const keys = item.key.split("[");

        if (keys[0] === "form") {
          return; // Skip objects with keys starting with "form"
        }

        // Extract the field key
        const fieldKey = keys[1].replace("]", "");

        // Check if the field has nested properties
        if (keys.includes("fields")) {
          if (!transformedObject[fieldKey]) {
            transformedObject[fieldKey] = {};
          }

          let currentObject = transformedObject[fieldKey];

          // Traverse the nested properties
          keys.slice(2, -1).forEach((property) => {
            if (!currentObject[property]) {
              currentObject[property] = {};
            }
            currentObject = currentObject[property];
          });

          // Assign the value to the last property
          currentObject[keys.slice(-1)[0].replace("]", "")] = item.value;
        } else {
          transformedObject[fieldKey] = item.value;
        }
      });

      return transformedObject;
    }

    try {
      const contactUsObject = {};

      if (!request.body) {
        throw new Error("Request body is missing or empty.");
      }

      const requestBodyJSON = await request.json();

      const transformedObject = transformListToObject(requestBodyJSON);

      for (const [key, value] of Object.entries(transformedObject)) {
        contactUsObject[value.title.toLowerCase()] = value.raw_value;
      }

      context.log("Contact us form submission successfully parsed");

      return {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactUsObject),
        status: 200,
      };
    } catch (error) {
      context.log("Error parsing Contact us form submission:", error.message);

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
