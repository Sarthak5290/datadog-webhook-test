// Dashboard page - Server Component that fetches webhooks

import { supabase } from '@/lib/supabase';
import { WebhookRecord } from '@/types/webhook';
import WebhookList from './WebhookList';
import EmptyState from '@/components/EmptyState';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage() {
  // Fetch webhooks from Supabase (server-side)
  const { data: webhooks, error } = await supabase
    .from('webhooks')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Error fetching webhooks:', error);
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Datadog Webhook Dashboard
          </h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">
              Error loading webhooks: {error.message}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Datadog Webhook Dashboard
        </h1>

        {webhooks && webhooks.length > 0 ? (
          <WebhookList webhooks={webhooks as WebhookRecord[]} />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
