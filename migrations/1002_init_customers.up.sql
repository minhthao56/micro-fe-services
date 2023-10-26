--- Add table customers ---
CREATE TABLE IF NOT EXISTS public.customers(
    customer_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    lat INTEGER,
    long INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    deleted_at TIMESTAMP
);

-- Add foreign key --
ALTER TABLE public.users ADD FOREIGN KEY ("user_id") REFERENCES public.customers ("user_id");

INSERT INTO public.customers (user_id) VALUES (2);
