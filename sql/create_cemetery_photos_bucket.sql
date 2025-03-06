
-- Check if the bucket already exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'cimitero-foto'
  ) THEN
    -- Create the bucket if it doesn't exist
    INSERT INTO storage.buckets (id, name, public) 
    VALUES ('cimitero-foto', 'Cemetery Photos', true);
    
    -- Add a policy to allow public read access to all objects in the bucket
    INSERT INTO storage.policies (name, definition, bucket_id)
    VALUES (
      'Public Read Access',
      '(bucket_id = ''cimitero-foto''::text)',
      'cimitero-foto'
    );
  END IF;
END
$$;
