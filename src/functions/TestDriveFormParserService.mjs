import { app } from "@azure/functions";

app.http("TestDriveFormParserService", {
  methods: ["POST"],
  authLevel: "function",
  handler: async (request, context) => {
    context.log("Test drive booking received.");

    // convert date string to date object
    function convertDate(dateString) {
      const date = new Date(dateString);
      return date.toISOString();
    }

    // extract test drive contact details from metadata property
    function extractContactDetails(metadata) {
      if (!metadata || metadata.length === 0) {
        throw new Error("Metadata is missing or empty.");
      }

      const contactDetails = {};

      for (const item of metadata) {
        if (item.key === "_raq_request") {
          const requestData = item.value;

          contactDetails.firstName = requestData.first_name.value;
          contactDetails.lastName = requestData.last_name.value;
          contactDetails.email = requestData.email.value;
          contactDetails.phone = requestData.phone.value;
          contactDetails.townCity = requestData?.towncity?.value;
          contactDetails.postcode = requestData?.postcode?.value;
          contactDetails.county = requestData?.county?.value;
        }
      }

      return contactDetails;
    }

    try {
      if (!request.body) {
        throw new Error("Request body is missing or empty.");
      }

      const orderRequest = await request.json();

      // parse order request
      const orderResponse = {};
      orderResponse.orderId = String(orderRequest.id);
      orderResponse.status = "new";
      orderResponse.dateCreated = convertDate(orderRequest.date_created);
      orderResponse.total = orderRequest.total;
      orderResponse.orderUrl = orderRequest._links.self[0].href;

      orderResponse.contact = extractContactDetails(orderRequest?.meta_data);

      orderResponse.lineItems = [];
      // loop through line items
      for (const item of orderRequest.line_items) {
        const lineItem = {};
        lineItem.productId = String(item.product_id);
        lineItem.name = item.name;
        lineItem.quantity = String(item.quantity);
        lineItem.total = item.total;
        lineItem.sku = item.sku;
        orderResponse.lineItems.push(lineItem);
      }

      context.log("Order form submission successfully parsed");

      return {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderResponse),
        status: 200,
      };
    } catch (error) {
      context.log("Error parsing Order form submission:", error.message);

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
