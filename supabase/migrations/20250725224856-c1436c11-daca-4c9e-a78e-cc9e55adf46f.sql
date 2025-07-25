-- Update orders table to use only numbers for order_code
ALTER TABLE public.orders 
ALTER COLUMN order_code SET DEFAULT nextval('orders_id_seq')::text;