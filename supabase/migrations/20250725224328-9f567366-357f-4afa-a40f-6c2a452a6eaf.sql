-- Drop existing tables and recreate with SERIAL IDs
DROP TABLE IF EXISTS public.order_items;
DROP TABLE IF EXISTS public.orders;

-- Create orders table with SERIAL ID and simple order_code
CREATE TABLE public.orders (
  id SERIAL PRIMARY KEY,
  order_code TEXT NOT NULL DEFAULT ('PED-' || nextval('orders_id_seq')),
  total_amount NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_items table with SERIAL ID and integer order_id
CREATE TABLE public.order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_code INTEGER NOT NULL,
  product_description TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price NUMERIC NOT NULL,
  total_price NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow public read access to orders" 
ON public.orders 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert access to orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public read access to order_items" 
ON public.order_items 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert access to order_items" 
ON public.order_items 
FOR INSERT 
WITH CHECK (true);