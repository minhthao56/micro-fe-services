--- Add table addresses ---
CREATE TABLE IF NOT EXISTS public.addresses(
    long INTEGER,
    lat INTEGER,
    name VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    deleted_at TIMESTAMP,
    PRIMARY KEY (long, lat)
);

ALTER TABLE public.customers ADD FOREIGN KEY ("long") REFERENCES public.addresses ("long");
ALTER TABLE public.customers ADD FOREIGN KEY ("lat") REFERENCES public.addresses ("lat");