// TypeScript types for Datadog webhooks

// Datadog webhook payload structure
// Based on Datadog's webhook documentation
export interface DatadogWebhookPayload {
  id?: string;
  title?: string;
  event_title?: string;
  body?: string;
  text?: string;
  event_msg?: string;
  alert_type?: string;
  alert_transition?: string;
  priority?: string;
  date?: number;
  tags?: string[];
  event_type?: string;
  org?: {
    id?: string;
    name?: string;
  };
  // Allow for additional fields
  [key: string]: unknown;
}

// Database webhook record type (matches the database schema)
export interface WebhookRecord {
  id: string;
  event_title: string;
  event_msg: string | null;
  alert_status: 'OK' | 'Alert' | 'Warning';
  priority: string | null;
  service_name: string | null;
  payload: Record<string, unknown>;
  created_at: string;
}

// Insert payload for creating new webhook records
export interface WebhookInsertPayload {
  event_title: string;
  event_msg: string | null;
  alert_status: 'OK' | 'Alert' | 'Warning';
  priority: string | null;
  service_name: string | null;
  payload: Record<string, unknown>;
}

// Helper type for alert status
export type AlertStatus = 'OK' | 'Alert' | 'Warning';

// Helper function to map Datadog alert types to our status
export function mapAlertStatus(
  alertType?: string,
  alertTransition?: string
): AlertStatus {
  const type = (alertType || alertTransition || '').toLowerCase();

  if (type.includes('error') || type.includes('triggered') || type.includes('critical')) {
    return 'Alert';
  }

  if (type.includes('warning') || type.includes('warn')) {
    return 'Warning';
  }

  if (type.includes('success') || type.includes('ok') || type.includes('recovered')) {
    return 'OK';
  }

  // Default to Alert for unknown types
  return 'Alert';
}

// Helper function to extract service name from tags
export function extractServiceName(tags?: string[]): string | null {
  if (!tags || !Array.isArray(tags)) return null;

  // Look for tags in the format "service:service-name"
  const serviceTag = tags.find(tag =>
    typeof tag === 'string' && tag.startsWith('service:')
  );

  if (serviceTag) {
    return serviceTag.replace('service:', '');
  }

  return null;
}

// Transform Datadog payload to database insert payload
export function transformWebhookPayload(
  payload: DatadogWebhookPayload
): WebhookInsertPayload {
  return {
    event_title: payload.title || payload.event_title || 'Untitled Alert',
    event_msg: payload.body || payload.text || payload.event_msg || null,
    alert_status: mapAlertStatus(payload.alert_type, payload.alert_transition),
    priority: payload.priority || 'P3',
    service_name: extractServiceName(payload.tags),
    payload: payload as Record<string, unknown>,
  };
}
