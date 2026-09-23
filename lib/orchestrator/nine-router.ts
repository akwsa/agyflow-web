export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type FetchLike = typeof fetch;

export type CompletionRequest = {
  model: string;
  messages: ChatMessage[];
  maxTokens?: number;
};

export type CompletionResult = {
  content: string;
  model?: string;
  totalTokens: number;
};

type NineRouterClientOptions = {
  baseUrl: string;
  apiKey: string;
  fetchImpl?: FetchLike;
};

export class NineRouterClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly fetchImpl: FetchLike;

  constructor({ baseUrl, apiKey, fetchImpl = fetch }: NineRouterClientOptions) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.apiKey = apiKey;
    this.fetchImpl = fetchImpl;
  }

  async complete(request: CompletionRequest): Promise<CompletionResult> {
    const response = await this.fetchImpl(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: request.model,
        messages: request.messages,
        max_tokens: request.maxTokens ?? 8_192,
        temperature: 0,
        stream: false,
      }),
    });

    const text = await response.text();
    if (!response.ok) {
      throw new Error(`9router request failed (${response.status}): ${text.slice(0, 500)}`);
    }

    let payload: {
      model?: string;
      choices?: Array<{ message?: { content?: string } }>;
      usage?: { total_tokens?: number };
    };
    try {
      payload = JSON.parse(text);
    } catch {
      throw new Error('9router returned invalid JSON');
    }

    const content = payload.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('9router returned no assistant content');
    }

    return {
      content,
      model: payload.model,
      totalTokens: payload.usage?.total_tokens ?? 0,
    };
  }
}
