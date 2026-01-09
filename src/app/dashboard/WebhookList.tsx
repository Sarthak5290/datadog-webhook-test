'use client';

// Client component for displaying webhook list

import { useState } from 'react';
import { WebhookRecord } from '@/types/webhook';
import StatusBadge from '@/components/StatusBadge';
import WebhookDetails from '@/components/WebhookDetails';

interface WebhookListProps {
  webhooks: WebhookRecord[];
}

export default function WebhookList({ webhooks }: WebhookListProps) {
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookRecord | null>(null);

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Webhooks
            </h2>
            <span className="text-sm text-gray-500">
              {webhooks.length} {webhooks.length === 1 ? 'webhook' : 'webhooks'}
            </span>
          </div>
        </div>

        {/* Webhook List */}
        <div className="divide-y divide-gray-200">
          {webhooks.map((webhook) => (
            <div
              key={webhook.id}
              onClick={() => setSelectedWebhook(webhook)}
              className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {webhook.event_title}
                  </h3>
                  {webhook.event_msg && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {webhook.event_msg}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <StatusBadge status={webhook.alert_status} />
                    {webhook.priority && (
                      <span className="text-xs text-gray-500">
                        {webhook.priority}
                      </span>
                    )}
                    {webhook.service_name && (
                      <span className="text-xs text-gray-500">
                        Service: {webhook.service_name}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <span className="text-xs text-gray-500">
                    {formatRelativeTime(webhook.created_at)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Webhook Details Modal */}
      {selectedWebhook && (
        <WebhookDetails
          webhook={selectedWebhook}
          onClose={() => setSelectedWebhook(null)}
        />
      )}
    </>
  );
}
