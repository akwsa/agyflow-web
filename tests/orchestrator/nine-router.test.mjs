import assert from 'node:assert/strict';
import test from 'node:test';

import { NineRouterClient } from '../../lib/orchestrator/nine-router.ts';

test('NineRouterClient sends an authenticated non-streaming chat request', async () => {
  let receivedUrl;
  let receivedInit;
  const fetchImpl = async (url, init) => {
    receivedUrl = url;
    receivedInit = init;
    return new Response(JSON.stringify({
      model: 'agnes-3.0-flash',
      choices: [{ message: { content: 'generated result' } }],
      usage: { prompt_tokens: 10, completion_tokens: 4, total_tokens: 14 },
    }), { status: 200, headers: { 'content-type': 'application/json' } });
  };

  const client = new NineRouterClient({
    baseUrl: 'http://127.0.0.1:20128/v1',
    apiKey: 'local-test-key',
    fetchImpl,
  });
  const result = await client.complete({
    model: 'agn/agnes-3.0-flash',
    messages: [{ role: 'user', content: 'Generate code' }],
    maxTokens: 128,
  });

  assert.equal(receivedUrl, 'http://127.0.0.1:20128/v1/chat/completions');
  assert.equal(receivedInit.headers.Authorization, 'Bearer local-test-key');
  assert.deepEqual(JSON.parse(receivedInit.body), {
    model: 'agn/agnes-3.0-flash',
    messages: [{ role: 'user', content: 'Generate code' }],
    max_tokens: 128,
    temperature: 0,
    stream: false,
  });
  assert.equal(result.content, 'generated result');
  assert.equal(result.totalTokens, 14);
});
