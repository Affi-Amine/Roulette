-- Script to ensure the tickets table is correctly set up for unique ticket IDs
-- Run this in your Supabase SQL Editor

-- 1. Ensure ticket_id is unique (if not already)
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_constraint 
        WHERE conname = 'tickets_ticket_id_key' 
    ) THEN 
        ALTER TABLE tickets 
        ADD CONSTRAINT tickets_ticket_id_key UNIQUE (ticket_id);
    END IF;
END $$;

-- 2. Add an index for faster lookups on ticket_id
CREATE INDEX IF NOT EXISTS idx_tickets_ticket_id ON tickets(ticket_id);

-- 3. (Optional) If you need to clear old test tickets to start fresh:
-- TRUNCATE TABLE tickets CASCADE;
