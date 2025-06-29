import { Webhooks } from '@octokit/webhooks';
import { verify } from '@octokit/webhooks-methods';
import { type NextRequest, NextResponse } from 'next/server';

const webhooks = new Webhooks({
  secret: process.env.GITHUB_WEBHOOK_SECRET ?? '',
});

webhooks.on('push', async ({ payload }) => {
  console.log('push event received', payload);

  const owner = 'tuatmcc';
  const repo = 'tuatmcc.com';
  const githubToken = process.env.GITHUB_TOKEN;

  if (!githubToken) {
    console.error(
      'Missing GITHUB_TOKEN environment variable for repository_dispatch',
    );
    return;
  }

  const dispatchUrl = `https://api.github.com/repos/${owner}/${repo}/dispatches`;

  try {
    const response = await fetch(dispatchUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${githubToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ event_type: 'webhook_received' }),
    });

    if (!response.ok) {
      console.error(
        `Failed to dispatch event: ${response.status} ${response.statusText}`,
      );
    }
  } catch (error) {
    console.error('Error dispatching event:', error);
  }
});

export async function POST(request: NextRequest) {
  const id = request.headers.get('x-github-delivery') ?? '';
  const name = request.headers.get('x-github-event') ?? '';
  const signature = request.headers.get('x-hub-signature-256') ?? '';
  const payload = await request.json();

  // Verify Secret
  if (
    !process.env.GITHUB_WEBHOOK_SECRET ||
    !(await verify(process.env.GITHUB_WEBHOOK_SECRET, payload, signature))
  ) {
    return NextResponse.json({ message: 'invalid token' }, { status: 401 });
  }

  // Check Event Type
  if (name !== 'push') {
    return NextResponse.json(
      { message: `Unsupported event type: ${name}` },
      { status: 400 },
    );
  }

  try {
    await webhooks.receive({
      id,
      name,
      payload,
    });
    return NextResponse.json({ message: 'ok' });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
