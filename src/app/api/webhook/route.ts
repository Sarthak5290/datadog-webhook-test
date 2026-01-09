// API route for receiving Datadog webhooks

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import {
  DatadogWebhookPayload,
  transformWebhookPayload,
} from '@/types/webhook';

export async function POST(request: NextRequest) {
  try {
    // 1. Parse the JSON body
    let payload: DatadogWebhookPayload;

    try {
      payload = await request.json();
    } catch (error) {
      console.error('Failed to parse JSON:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid JSON payload',
        },
        { status: 400 }
      );
    }

    // 2. Basic validation - ensure we have at least a title or body
    if (!payload.title && !payload.event_title && !payload.body && !payload.text) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: title or body',
        },
        { status: 400 }
      );
    }

    // 3. Transform the Datadog payload to our database format
    const insertPayload = transformWebhookPayload(payload);

    // 4. Insert into Supabase
    const { data, error } = await supabase
      .from('webhooks')
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to store webhook data',
          details: error.message,
        },
        { status: 500 }
      );
    }

    // 5. Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Webhook received and stored successfully',
        id: data.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// Handle non-POST requests
export async function GET() {
  return NextResponse.json(
    {
      message: 'Datadog Webhook Endpoint',
      info: 'Send POST requests to this endpoint from Datadog',
    },
    { status: 200 }
  );
}
