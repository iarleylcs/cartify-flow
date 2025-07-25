-- Create policy to allow public read access to products table
-- This is needed for the product catalog to be visible to all users
CREATE POLICY "Allow public read access to products" 
ON public.products 
FOR SELECT 
USING (true);