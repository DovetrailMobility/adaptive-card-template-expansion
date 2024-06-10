import { app } from "@azure/functions";

app.http("OrderFormParserService", {
  methods: ["POST"],
  authLevel: "function",
  handler: async (request, context) => {
    context.log("WooCommerce order request received.");
    context.log("Request body: ", request.body);

    try {
      if (!request.body) {
        throw new Error("Request body is missing or empty.");
      }

      const orderRequest = await request.json();

      // parse order request
      const orderResponse = {};
      orderResponse.orderId = String(orderRequest.id);
      orderResponse.status = orderRequest.status;
      orderResponse.dateCreated = orderRequest.date_created;
      orderResponse.total = orderRequest.total;
      orderResponse.orderUrl = orderRequest._links.self[0].href;
      orderResponse.billingAddress = {};
      orderResponse.billingAddress.firstName =
        orderRequest?.billing?.first_name;
      orderResponse.billingAddress.lastName = orderRequest?.billing?.last_name;
      orderResponse.billingAddress.email = orderRequest?.billing?.email;
      orderResponse.billingAddress.phone = orderRequest?.billing?.phone;
      orderResponse.billingAddress.address1 = orderRequest?.billing?.address_1;
      orderResponse.billingAddress.address2 = orderRequest?.billing?.address_2;
      orderResponse.billingAddress.city = orderRequest?.billing?.city;
      orderResponse.billingAddress.state = orderRequest?.billing?.state;
      orderResponse.billingAddress.postcode = orderRequest?.billing?.postcode;
      orderResponse.billingAddress.country = orderRequest?.billing?.country;
      orderResponse.shippingAddress = {};
      orderResponse.shippingAddress.firstName =
        orderRequest?.shipping?.first_name;
      orderResponse.shippingAddress.lastName =
        orderRequest?.shipping?.last_name;
      orderResponse.shippingAddress.phone = orderRequest?.shipping?.phone;
      orderResponse.shippingAddress.address1 =
        orderRequest?.shipping?.address_1;
      orderResponse.shippingAddress.address2 =
        orderRequest?.shipping?.address_2;
      orderResponse.shippingAddress.city = orderRequest?.shipping?.city;
      orderResponse.shippingAddress.state = orderRequest?.shipping?.state;
      orderResponse.shippingAddress.postcode = orderRequest?.shipping?.postcode;
      orderResponse.shippingAddress.country = orderRequest?.shipping?.country;
      orderResponse.paymentMethod = orderRequest?.payment_method;
      orderResponse.paymentMethodTitle = orderRequest?.payment_method_title;
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
