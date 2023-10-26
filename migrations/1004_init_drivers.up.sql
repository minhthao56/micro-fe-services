
--- Add table drivers ---
CREATE TABLE IF NOT EXISTS public.drivers(
    driver_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    status VARCHAR(255),
    vehicle_type_id INTEGER,
    current_lat INTEGER,
    current_long INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    deleted_at TIMESTAMP
);

-- Add FOREIGN KEY
ALTER TABLE public.users ADD FOREIGN KEY ("user_id") REFERENCES public.drivers ("user_id");

--- Add table vehicle_types ---
CREATE TABLE IF NOT EXISTS public.vehicle_types(
    vehicle_type_id SERIAL PRIMARY KEY,
    vehicle_name VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    deleted_at TIMESTAMP
);

-- Add FOREIGN KEY
ALTER TABLE public.drivers ADD FOREIGN KEY ("vehicle_type_id") REFERENCES public.vehicle_types ("vehicle_type_id");

INSERT INTO public.vehicle_types (vehicle_name)
VALUES ("Taxi 4 seats"), ("Taxi 7 seats"), ("Taxi 16 seats"), ("Taxi 29 seats"), ("Taxi 45 seats");

INSERT INTO public.drivers (user_id, vehicle_type_id, status)
VALUES (3, 1, "ONLINE"), (4, 2, "ONLINE"), (5, 3, "ONLINE"), (6, 4, "ONLINE"), (7, 5, "ONLINE");
