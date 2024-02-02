import assert from 'assert';

import templatePayload from './adaptive-card-template.json' assert { type: "json" };
import dataPayload from './adaptive-card-data.json' assert { type: "json" };
import expectedCardPayload from './adaptive-card.json' assert { type: "json" };

const functionUrl = 'http://localhost:7071/api/AdaptiveCardTemplateExpansionService'

async function getExpandedTemplatePayload(templatePayload, dataPayload) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      template: templatePayload,
      data: dataPayload
    })
  };
  const actualCardPayload = await fetch(functionUrl, options)
    .then(res => res.json())
    .then(json => {
      return json;
    })
    .catch(err => {
      console.error(err);
      return err;
    });
  return actualCardPayload;
}

describe('AdaptiveCardTemplateExpansionService', () => {
    it('should return the expected card payload', async () => {
      const actualCardPayload = await getExpandedTemplatePayload(templatePayload, dataPayload);
      assert.deepStrictEqual(actualCardPayload, expectedCardPayload);
    });

    it('should return an error when template payload is undefined', async () => {
      const expectedCardPayload = { error: 'An error occurred processing the request: Template or data payload is missing.' };
      const actualCardPayload = await getExpandedTemplatePayload(undefined, dataPayload);
      assert.deepStrictEqual(actualCardPayload, expectedCardPayload);
    });

    it('should return an error when data payload is undefined', async () => {
      const expectedCardPayload = { error: 'An error occurred processing the request: Template or data payload is missing.' };
      const actualCardPayload = await getExpandedTemplatePayload(templatePayload, undefined);
      assert.deepStrictEqual(actualCardPayload, expectedCardPayload);
    });

    it('should return an error when template payload is invalid', async () => {
      const expectedCardPayload = { error: 'An error occurred processing the request: Template or data payload JSON is invalid.' };
      const actualCardPayload = await getExpandedTemplatePayload('invalid', dataPayload);
      assert.deepStrictEqual(actualCardPayload, expectedCardPayload);
    });

    it('should return an error when data payload is invalid', async () => {
      const expectedCardPayload = { error: 'An error occurred processing the request: Template or data payload JSON is invalid.' };
      const actualCardPayload = await getExpandedTemplatePayload(templatePayload, 'invalid');
      assert.deepStrictEqual(actualCardPayload, expectedCardPayload);
    });

    it('should return an error when template payload is empty', async () => {
      const expectedCardPayload = { error: 'An error occurred processing the request: Template or data payload is missing.' };
      const actualCardPayload = await getExpandedTemplatePayload('', dataPayload);
      assert.deepStrictEqual(actualCardPayload, expectedCardPayload);
    });

    it('should return an error when data payload is empty', async () => {
      const expectedCardPayload = { error: 'An error occurred processing the request: Template or data payload is missing.' };
      const actualCardPayload = await getExpandedTemplatePayload(templatePayload, '');
      assert.deepStrictEqual(actualCardPayload, expectedCardPayload);
    });

    it('should return an error when template payload is null', async () => {
      const expectedCardPayload = { error: 'An error occurred processing the request: Template or data payload is missing.' };
      const actualCardPayload = await getExpandedTemplatePayload(null, dataPayload);
      assert.deepStrictEqual(actualCardPayload, expectedCardPayload);
    });

    it('should return an error when data payload is null', async () => {
      const expectedCardPayload = { error: 'An error occurred processing the request: Template or data payload is missing.' };
      const actualCardPayload = await getExpandedTemplatePayload(templatePayload, null);
      assert.deepStrictEqual(actualCardPayload, expectedCardPayload);
    });

    it('should return an error when template payload is missing $schema property', async () => {
      const expectedCardPayload = { error: 'An error occurred processing the request: Template $schema is missing or invalid.' };
      const templatePayloadWithoutSchema = { ...templatePayload };
      delete templatePayloadWithoutSchema.$schema;

      const actualCardPayload = await getExpandedTemplatePayload(templatePayloadWithoutSchema, dataPayload);
      assert.deepStrictEqual(actualCardPayload, expectedCardPayload);
    });

    it('should return an error when template payload is missing type property', async () => {
      const expectedCardPayload = { error: 'An error occurred processing the request: Template type is missing or invalid.' };
      const templatePayloadWithoutType = { ...templatePayload };
      delete templatePayloadWithoutType.type;

      const actualCardPayload = await getExpandedTemplatePayload(templatePayloadWithoutType, dataPayload);
      assert.deepStrictEqual(actualCardPayload, expectedCardPayload);
    });

    it('should return an error when template payload is missing version property', async () => {
      const expectedCardPayload = { error: 'An error occurred processing the request: Template version is missing.' };
      const templatePayloadWithoutVersion = { ...templatePayload };
      delete templatePayloadWithoutVersion.version;

      const actualCardPayload = await getExpandedTemplatePayload(templatePayloadWithoutVersion, dataPayload);
      assert.deepStrictEqual(actualCardPayload, expectedCardPayload);
    });

    it('should return an error when template payload is missing body property', async () => {
      const expectedCardPayload = { error: 'An error occurred processing the request: Template body is missing.' };
      const templatePayloadWithoutBody = { ...templatePayload };
      delete templatePayloadWithoutBody.body;

      const actualCardPayload = await getExpandedTemplatePayload(templatePayloadWithoutBody, dataPayload);
      assert.deepStrictEqual(actualCardPayload, expectedCardPayload);
    });

    it('should return an error when template payload type property is not AdaptiveCard', async () => {
      const expectedCardPayload = { error: 'An error occurred processing the request: Template type is missing or invalid.' };
      const templatePayloadWithInvalidType = { ...templatePayload };
      templatePayloadWithInvalidType.type = 'Invalid';

      const actualCardPayload = await getExpandedTemplatePayload(templatePayloadWithInvalidType, dataPayload);
      assert.deepStrictEqual(actualCardPayload, expectedCardPayload);
    });
  }
);