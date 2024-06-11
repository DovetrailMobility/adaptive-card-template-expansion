import assert from "assert";

// import requestPayload from "./order-type-request.json" assert { type: "json" };
// import responsePayload from "./order-type-response.json" assert { type: "json" };

const functionUrl = process.env.ORDER_TYPE_FUNCTION_INVOKE_URL;

async function getOrderTypeService(requestPayload) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestPayload),
  };

  const response = await fetch(functionUrl, options)
    .then((res) => res.json())
    .then((json) => {
      return json;
    })
    .catch((err) => {
      console.error(err);
      return err;
    });

  return response;
}

describe("GetOrderTypeService", () => {
  it("should return correct order type for order with on-hold status", async () => {
    const actualResponsePayload = await getOrderTypeService({
      id: 123,
      status: "on-hold",
    });
    const expectedResponsePayload = {
      orderType: "sale",
    };
    assert.deepStrictEqual(actualResponsePayload, expectedResponsePayload);
  });

  it("should return correct order type for order with ywraq-new status", async () => {
    const actualResponsePayload = await getOrderTypeService({
      id: 123,
      status: "ywraq-new",
    });
    const expectedResponsePayload = {
      orderType: "testDrive",
    };
    assert.deepStrictEqual(actualResponsePayload, expectedResponsePayload);
  });

  it("should return correct order type for order with pending status", async () => {
    const actualResponsePayload = await getOrderTypeService({
      id: 123,
      status: "pending",
    });
    const expectedResponsePayload = {
      orderType: "sale",
    };
    assert.deepStrictEqual(actualResponsePayload, expectedResponsePayload);
  });

  it("should return an error when form payload is undefined", async () => {
    const actualResponsePayload = await getOrderTypeService(undefined);
    const expectedResponsePayload = {
      error:
        "An error occurred processing the request: Request body is missing or empty.",
    };
    assert.deepStrictEqual(actualResponsePayload, expectedResponsePayload);
  });
});
