import assert from "assert";

import formPayload from "./web-to-lead-form-request.json" with { type: "json" };
import expectedParsedFormPayload from "./web-to-lead-form-response.json" with { type: "json" };

const functionUrl = process.env.WEB_TO_LEAD_FUNCTION_INVOKE_URL;

async function getParsedFormPayload(payload) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  const respose = await fetch(functionUrl, options)
    .then((res) => res.json())
    .then((json) => {
      return json;
    })
    .catch((err) => {
      console.error(err);
      return err;
    });

  return respose;
}

describe("WebToLeadFormParserService", () => {
  it("should return the expected form payload", async () => {
    const actualParsedFormPayload = await getParsedFormPayload(formPayload);
    assert.deepStrictEqual(actualParsedFormPayload, expectedParsedFormPayload);
  });

  it("should return an error when form payload is undefined", async () => {
    const expectedParsedFormPayload = {
      error:
        "An error occurred processing the request: Request body is missing or empty.",
    };
    const actualParsedFormPayload = await getParsedFormPayload(undefined);
    assert.deepStrictEqual(actualParsedFormPayload, expectedParsedFormPayload);
  });
});
