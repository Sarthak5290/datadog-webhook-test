'use client';

// Empty state component shown when no webhooks exist

import { useState } from 'react';

export default function EmptyState() {
  const [copied, setCopied] = useState(false);

  // Get the webhook URL (will be different in production)
  const webhookUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/api/webhook`
    : '/api/webhook';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="text-center py-12">
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
      <h3 className="mt-2 text-sm font-semibold text-gray-900">
        No webhooks received yet
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Configure Datadog to send webhooks to your endpoint.
      </p>

      <div className="mt-6 max-w-xl mx-auto">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-xs font-medium text-gray-700 mb-2">
            Webhook Endpoint URL:
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-white px-3 py-2 rounded border border-gray-300 text-sm text-gray-900 overflow-x-auto">
              {webhookUrl}
            </code>
            <button
              onClick={handleCopy}
              className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="mt-4 text-left bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-xs font-medium text-blue-900 mb-2">
            Quick Setup:
          </p>
          <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
            <li>Go to Datadog Integrations → Webhooks</li>
            <li>Create a new webhook with the URL above</li>
            <li>Add the webhook to your monitor notifications</li>
            <li>Trigger an alert to test</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
