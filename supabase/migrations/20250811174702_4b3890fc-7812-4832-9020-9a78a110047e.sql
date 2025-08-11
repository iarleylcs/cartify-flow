-- Enable Row Level Security on Leads table
ALTER TABLE public."Leads" ENABLE ROW LEVEL SECURITY;

-- Create policy to restrict access to authenticated users only
-- This prevents anonymous access to sensitive customer data
CREATE POLICY "Only authenticated users can access leads"
ON public."Leads"
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create policy to deny all access to anonymous users
CREATE POLICY "Deny anonymous access to leads"
ON public."Leads"
FOR ALL
TO anon
USING (false)
WITH CHECK (false);