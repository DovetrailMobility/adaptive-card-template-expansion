import { app } from "@azure/functions";

app.http("TestDriveFormParserService", {
  methods: ["POST"],
  authLevel: "function",
  handler: async (request, context) => {
    // convert date string to date object
    function convertDate(dateString) {
      if (!dateString) {
        throw new Error("Date string is missing or empty.");
      }

      try {
        const date = new Date(dateString);
        return date.toISOString();
      } catch (error) {
        throw new Error(`Error converting date string: ${error.message}`);
      }
    }

    function getDateFromISOString(dateTimeISOString) {
      if (!dateTimeISOString) {
        throw new Error("Date time string is missing or empty.");
      }

      try {
        const date = dateTimeISOString
          .split("T")[0]
          .split("-")
          .reverse()
          .join("-");
        return date;
      } catch (error) {
        throw new Error(
          `Error extracting date from ISO string: ${error.message}`,
        );
      }
    }

    function getTimeFromISOString(dataTimeISOString) {
      if (!dataTimeISOString) {
        throw new Error("Date time string is missing or empty.");
      }

      try {
        const time = dataTimeISOString.split("T")[1].split(".")[0];
        return time;
      } catch (error) {
        throw new Error(
          `Error extracting time from ISO string: ${error.message}`,
        );
      }
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

    context.log("Test drive booking received.");

    try {
      if (!request.body) {
        throw new Error("Request body is missing or empty.");
      }

      const orderRequest = await request.json();

      // parse order request
      const orderResponse = {};
      orderResponse.orderId = String(orderRequest.id);

      context.log("Processing orderId:", orderResponse.orderId);

      orderResponse.status = "new";
      orderResponse.createdTimestamp = convertDate(orderRequest.date_created);
      orderResponse.createdDate = getDateFromISOString(
        orderResponse.createdTimestamp,
      );
      orderResponse.createdTime = getTimeFromISOString(
        orderResponse.createdTimestamp,
      );
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
