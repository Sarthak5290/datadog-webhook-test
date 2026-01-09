-- Create webhooks table for storing Datadog webhook data
CREATE TABLE IF NOT EXISTS webhooks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_title TEXT NOT NULL,
  event_msg TEXT,
  alert_status TEXT NOT NULL CHECK (alert_status IN ('OK', 'Alert', 'Warning')),
  priority TEXT,
  service_name TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for efficient querying
CREATE INDEX idx_webhooks_created_at ON webhooks(created_at DESC);
CREATE INDEX idx_webhooks_alert_status ON webhooks(alert_status);
CREATE INDEX idx_webhooks_service_name ON webhooks(service_name);

-- Enable Row Level Security (optional for simple version, but good practice)
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts (for webhook endpoint)
CREATE POLICY "Allow public inserts" ON webhooks
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy to allow public reads (for dashboard - no auth)
CREATE POLICY "Allow public reads" ON webhooks
  FOR SELECT
  TO anon
  USING (true);

-- Add comment for documentation
COMMENT ON TABLE webhooks IS 'Stores webhook data received from Datadog alerts';
