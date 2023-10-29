CREATE TABLE IF NOT EXISTS public.addresses(
    long DOUBLE PRECISION,
    lat DOUBLE PRECISION,
    name VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    PRIMARY KEY (long, lat)
);


ALTER TABLE public.customers DROP CONSTRAINT IF EXISTS fk_addresses_customers;

INSERT INTO public.addresses (long, lat, name)
VALUES (106.629662, 10.823099, 'Ho Chi Minh');