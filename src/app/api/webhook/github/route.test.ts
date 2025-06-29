import type { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock environment variables
const mockEnv = {
  GITHUB_WEBHOOK_SECRET: 'test-secret',
  GITHUB_TOKEN: 'test-token',
};

// Mock dependencies
const mockWebhooksInstance = {
  on: vi.fn(),
  receive: vi.fn(),
};

const mockVerify = vi.fn();
const mockNextResponse = {
  json: vi.fn((body: unknown, options?: { status?: number }) => ({
    json: vi.fn().mockResolvedValue(body),
    status: options?.status || 200,
  })),
};

vi.mock('@octokit/webhooks', () => ({
  Webhooks: vi.fn().mockImplementation(() => mockWebhooksInstance),
}));

vi.mock('@octokit/webhooks-methods', () => ({
  verify: mockVerify,
}));

vi.mock('next/server', () => ({
  NextRequest: vi.fn(),
  NextResponse: mockNextResponse,
}));

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Clear module cache to ensure fresh imports
beforeEach(() => {
  vi.resetModules();
});

describe('/api/webhook/github', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock environment variables
    Object.assign(process.env, mockEnv);

    // Reset mocks
    mockWebhooksInstance.receive.mockResolvedValue(undefined);
    mockVerify.mockResolvedValue(true);
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // Clean up environment variables
    for (const key in mockEnv) {
      process.env[key] = undefined;
    }
  });

  const createMockRequest = (
    payload: unknown,
    headers: Record<string, string> = {},
  ): NextRequest => {
    const defaultHeaders: Record<string, string> = {
      'x-github-delivery': 'test-delivery-id',
      'x-github-event': 'push',
      'x-hub-signature-256': 'sha256=test-signature',
      ...headers,
    };

    return {
      headers: {
        get: vi.fn((key: string) => defaultHeaders[key] || ''),
      },
      json: vi.fn().mockResolvedValue(payload),
    } as unknown as NextRequest;
  };

  describe('POST', () => {
    it('should return 401 when GITHUB_WEBHOOK_SECRET is missing', async () => {
      process.env.GITHUB_WEBHOOK_SECRET = undefined;

      const { POST } = await import('./route');
      const request = createMockRequest({ test: 'payload' });
      const response = await POST(request);

      expect(response.status).toBe(401);
      const responseData = await response.json();
      expect(responseData.message).toBe('invalid token');
    });

    it('should return 401 when signature verification fails', async () => {
      mockVerify.mockResolvedValue(false);

      const { POST } = await import('./route');
      const request = createMockRequest({ test: 'payload' });
      const response = await POST(request);

      expect(response.status).toBe(401);
      const responseData = await response.json();
      expect(responseData.message).toBe('invalid token');
      expect(mockVerify).toHaveBeenCalledWith(
        'test-secret',
        { test: 'payload' },
        'sha256=test-signature',
      );
    });

    it('should return 400 for unsupported event types', async () => {
      mockVerify.mockResolvedValue(true);

      const { POST } = await import('./route');
      const request = createMockRequest(
        { test: 'payload' },
        { 'x-github-event': 'pull_request' },
      );

      const response = await POST(request);

      expect(response.status).toBe(400);
      const responseData = await response.json();
      expect(responseData.message).toBe('Unsupported event type: pull_request');
    });

    it('should successfully process push events', async () => {
      mockVerify.mockResolvedValue(true);
      mockWebhooksInstance.receive.mockResolvedValue(undefined);

      const payload = {
        repository: {
          name: 'test-repo',
          owner: { login: 'test-owner' },
        },
        commits: [{ id: 'abc123' }],
      };

      const { POST } = await import('./route');
      const request = createMockRequest(payload);
      const response = await POST(request);

      expect(response.status).toBe(200);
      const responseData = await response.json();
      expect(responseData.message).toBe('ok');

      expect(mockWebhooksInstance.receive).toHaveBeenCalledWith({
        id: 'test-delivery-id',
        name: 'push',
        payload,
      });
    });

    it('should return 500 when webhook processing throws an error', async () => {
      mockVerify.mockResolvedValue(true);
      const error = new Error('Webhook processing failed');
      mockWebhooksInstance.receive.mockRejectedValue(error);

      const { POST } = await import('./route');
      const request = createMockRequest({ test: 'payload' });
      const response = await POST(request);

      expect(response.status).toBe(500);
      const responseData = await response.json();
      expect(responseData.message).toBe('Webhook processing failed');
    });

    it('should return 500 with generic message for non-Error exceptions', async () => {
      mockVerify.mockResolvedValue(true);
      mockWebhooksInstance.receive.mockRejectedValue('String error');

      const { POST } = await import('./route');
      const request = createMockRequest({ test: 'payload' });
      const response = await POST(request);

      expect(response.status).toBe(500);
      const responseData = await response.json();
      expect(responseData.message).toBe('Internal Server Error');
    });

    it('should handle missing headers gracefully', async () => {
      mockVerify.mockResolvedValue(true);

      const request = {
        headers: {
          get: vi.fn().mockReturnValue(''),
        },
        json: vi.fn().mockResolvedValue({ test: 'payload' }),
      } as unknown as NextRequest;

      const { POST } = await import('./route');
      const response = await POST(request);

      expect(response.status).toBe(400);
      const responseData = await response.json();
      expect(responseData.message).toBe('Unsupported event type: ');
    });

    it('should call verify with correct parameters', async () => {
      mockVerify.mockResolvedValue(true);
      mockWebhooksInstance.receive.mockResolvedValue(undefined);

      const payload = { test: 'data' };
      const request = createMockRequest(payload, {
        'x-hub-signature-256': 'sha256=custom-signature',
      });

      const { POST } = await import('./route');
      await POST(request);

      expect(mockVerify).toHaveBeenCalledWith(
        'test-secret',
        payload,
        'sha256=custom-signature',
      );
    });
  });

  describe('push event handler', () => {
    let consoleSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    it('should register push event handler', async () => {
      await import('./route');

      expect(mockWebhooksInstance.on).toHaveBeenCalledWith(
        'push',
        expect.any(Function),
      );
    });

    it('should dispatch repository event when GITHUB_TOKEN is present', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
      });

      await import('./route');

      // Get the push handler that was registered
      const pushHandlerCall = mockWebhooksInstance.on.mock.calls.find(
        (call: unknown[]) => call[0] === 'push',
      );

      expect(pushHandlerCall).toBeDefined();

      if (pushHandlerCall) {
        const pushHandler = pushHandlerCall[1] as ({
          payload,
        }: { payload: unknown }) => Promise<void>;

        const mockPayload = {
          repository: {
            name: 'test-repo',
            owner: { login: 'test-owner' },
          },
        };

        await pushHandler({ payload: mockPayload });

        expect(mockFetch).toHaveBeenCalledWith(
          'https://api.github.com/repos/tuatmcc/tuatmcc.com/dispatches',
          {
            method: 'POST',
            headers: {
              Accept: 'application/vnd.github.v3+json',
              Authorization: 'token test-token',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ event_type: 'webhook_received' }),
          },
        );
      }
    });

    it('should log error when GITHUB_TOKEN is missing', async () => {
      process.env.GITHUB_TOKEN = undefined;

      await import('./route');

      // Get the push handler that was registered
      const pushHandlerCall = mockWebhooksInstance.on.mock.calls.find(
        (call: unknown[]) => call[0] === 'push',
      );

      if (pushHandlerCall) {
        const pushHandler = pushHandlerCall[1] as ({
          payload,
        }: { payload: unknown }) => Promise<void>;

        await pushHandler({ payload: {} });

        expect(consoleSpy).toHaveBeenCalledWith(
          'Missing GITHUB_TOKEN environment variable for repository_dispatch',
        );
        expect(mockFetch).not.toHaveBeenCalled();
      }
    });

    it('should log error when dispatch request fails', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      });

      await import('./route');

      // Get the push handler that was registered
      const pushHandlerCall = mockWebhooksInstance.on.mock.calls.find(
        (call: unknown[]) => call[0] === 'push',
      );

      if (pushHandlerCall) {
        const pushHandler = pushHandlerCall[1] as ({
          payload,
        }: { payload: unknown }) => Promise<void>;

        await pushHandler({ payload: {} });

        expect(consoleSpy).toHaveBeenCalledWith(
          'Failed to dispatch event: 401 Unauthorized',
        );
      }
    });

    it('should log error when fetch throws an exception', async () => {
      const fetchError = new Error('Network error');
      mockFetch.mockRejectedValue(fetchError);

      await import('./route');

      // Get the push handler that was registered
      const pushHandlerCall = mockWebhooksInstance.on.mock.calls.find(
        (call: unknown[]) => call[0] === 'push',
      );

      if (pushHandlerCall) {
        const pushHandler = pushHandlerCall[1] as ({
          payload,
        }: { payload: unknown }) => Promise<void>;

        await pushHandler({ payload: {} });

        expect(consoleSpy).toHaveBeenCalledWith(
          'Error dispatching event:',
          fetchError,
        );
      }
    });
  });
});
