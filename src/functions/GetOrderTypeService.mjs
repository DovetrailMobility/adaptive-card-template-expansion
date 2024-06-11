import { app } from "@azure/functions";

app.http("GetOrderTypeService", {
  methods: ["POST"],
  authLevel: "function",
  handler: async (request, context) => {
    context.log("Order type request received.");

    try {
      if (!request.body) {
        throw new Error("Request body is missing or empty.");
      }

      const order = await request.json();

      context.log("Processing orderId:", order.id);

      const response = {};
      if (order.status === "ywraq-new") {
        response.orderType = "testDrive";
      } else {
        response.orderType = "sale";
      }

      context.log("Order type request successfully processed.");

      return {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(response),
        status: 200,
      };
    } catch (error) {
      context.log("Error getting order type:", error.message);

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
