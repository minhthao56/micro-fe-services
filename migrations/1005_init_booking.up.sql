--- Add table booking ---
CREATE TABLE IF NOT EXISTS public.booking(
    start_long INTEGER,
    start_lat INTEGER,
    end_lat INTEGER,
    end_long INTEGER,
    driver_id INTEGER,
    status VARCHAR(255),
    customer_id INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    deleted_at TIMESTAMP,
    PRIMARY KEY (driver_id, customer_id)
);

-- Add FOREIGN KEY

ALTER TABLE public.booking ADD FOREIGN KEY ("driver_id") REFERENCES public.drivers ("driver_id");

ALTER TABLE public.booking ADD FOREIGN KEY ("customer_id") REFERENCES public.customers ("customer_id");

ALTER TABLE public.booking ADD FOREIGN KEY ("start_long") REFERENCES public.addresses ("long");

ALTER TABLE public.booking ADD FOREIGN KEY ("start_lat") REFERENCES public.addresses ("lat");

ALTER TABLE public.booking ADD FOREIGN KEY ("end_long") REFERENCES public.addresses ("long");

ALTER TABLE public.booking ADD FOREIGN KEY ("end_lat") REFERENCES public.addresses ("lat");
