import assert from "assert";

import requestPayload from "./test-drive-form-request.json" assert { type: "json" };
import responsePayload from "./test-drive-form-response.json" assert { type: "json" };

const functionUrl = process.env.TEST_DRIVE_FUNCTION_INVOKE_URL;

async function testDriveFormParserService(requestPayload) {
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

describe("TestDriveFormParserService", () => {
  it("should return the expected json payload", async () => {
    const actualResponsePayload =
      await testDriveFormParserService(requestPayload);
    const expectedResponsePayload = responsePayload;
    assert.deepStrictEqual(actualResponsePayload, expectedResponsePayload);
  });

  it("should return orderId as string", async () => {
    const actualType = typeof responsePayload.orderId;
    const expectedType = "string";
    assert.strictEqual(actualType, expectedType);
  });

  it("should return line item productId as string", async () => {
    const actualType = typeof responsePayload.lineItems[0].productId;
    const expectedType = "string";
    assert.strictEqual(actualType, expectedType);
  });

  it("should return line item quantity as string", async () => {
    const actualType = typeof responsePayload.lineItems[0].quantity;
    const expectedType = "string";
    assert.strictEqual(actualType, expectedType);
  });

  it("should return an error when form payload is undefined", async () => {
    const actualResponsePayload = await testDriveFormParserService(undefined);
    const expectedResponsePayload = {
      error:
        "An error occurred processing the request: Request body is missing or empty.",
    };
    assert.deepStrictEqual(actualResponsePayload, expectedResponsePayload);
  });

  it("should return an error when the created timmestamp is missing", async () => {
    const actualResponsePayload = await testDriveFormParserService({
      ...requestPayload,
      date_created: undefined,
    });
    const expectedResponsePayload = {
      error:
        "An error occurred processing the request: Date string is missing or empty.",
    };
    assert.deepStrictEqual(actualResponsePayload, expectedResponsePayload);
  });

  it("should return an error when the created timestamp is invalid", async () => {
    const actualResponsePayload = await testDriveFormParserService({
      ...requestPayload,
      date_created: "invalid",
    });
    const expectedResponsePayload = {
      error:
        "An error occurred processing the request: Error converting date string: Invalid time value",
    };
    assert.deepStrictEqual(actualResponsePayload, expectedResponsePayload);
  });
});
