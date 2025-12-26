-- 1. Add image_url column to prizes table
ALTER TABLE prizes 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 2. Create the storage bucket for prize images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('prize-images', 'prize-images', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Set up RLS policies for the storage bucket
-- Allow public read access
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'prize-images' );

-- Allow authenticated users (admins) to upload/update/delete
CREATE POLICY "Admin Upload" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'prize-images' );

CREATE POLICY "Admin Update" 
ON storage.objects FOR UPDATE 
WITH CHECK ( bucket_id = 'prize-images' );

CREATE POLICY "Admin Delete" 
ON storage.objects FOR DELETE 
USING ( bucket_id = 'prize-images' );
