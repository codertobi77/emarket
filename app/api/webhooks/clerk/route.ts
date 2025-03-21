import { WebhookEvent } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { Webhook } from 'svix';

// This endpoint handles Clerk webhooks
// See https://clerk.com/docs/integration/webhooks for more information

// Default role for new users if none is selected
const DEFAULT_ROLE = 'client';

export async function POST(req: Request) {
  // Get the webhook secret from the environment
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
    return new NextResponse('Please add CLERK_WEBHOOK_SECRET to .env', { status: 500 });
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse('Error: Missing svix headers', { status: 400 });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with the webhook secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the webhook
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new NextResponse('Error verifying webhook', { status: 400 });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === 'user.created') {
    // Get user data from the event
    const { id, unsafe_metadata } = evt.data;
    
    // Get the role from unsafe_metadata or use the default role
    const userRole = unsafe_metadata?.role || DEFAULT_ROLE;
    
    try {
      // Call Clerk API to update user metadata with role
      const response = await fetch(`https://api.clerk.dev/v1/users/${id}/metadata`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          public_metadata: {
            role: userRole,
          },
        }),
      });

      if (!response.ok) {
        console.error('Error setting user role:', await response.text());
        return new NextResponse('Error setting user role', { status: 500 });
      }

      console.log(`User ${id} created with role ${userRole}`);
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error setting user role:', error);
      return new NextResponse('Error setting user role', { status: 500 });
    }
  }

  // Return a 200 response for other event types
  return NextResponse.json({ success: true });
}