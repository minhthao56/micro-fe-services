-- Add table customers with a UNIQUE constraint on user_id --
CREATE TABLE IF NOT EXISTS public.customers(
    customer_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE,
    lat VARCHAR(80),
    long VARCHAR(80),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP
);


ALTER TABLE public.customers DROP CONSTRAINT IF EXISTS fk_users_customers;

ALTER TABLE public.customers DROP CONSTRAINT IF EXISTS unique_long_lat;

ALTER TABLE public.customers
    ADD CONSTRAINT fk_users_customers FOREIGN KEY (user_id) REFERENCES public.users (user_id);

INSERT INTO public.customers (user_id) VALUES (2);
