
--- Add table drivers ---
CREATE TABLE IF NOT EXISTS public.drivers(
    driver_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE,
    status VARCHAR(255),
    vehicle_type_id INTEGER,
    current_lat DOUBLE PRECISION,
    current_long DOUBLE PRECISION,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- Add FOREIGN KEY
ALTER TABLE public.drivers DROP CONSTRAINT IF EXISTS fk_users_drivers;
ALTER TABLE public.drivers 
    ADD CONSTRAINT fk_users_drivers FOREIGN KEY (user_id) REFERENCES public.users (user_id);

ALTER TABLE public.drivers DROP CONSTRAINT IF EXISTS constant_status_driver;
ALTER TABLE public.drivers
    ADD CONSTRAINT constant_status_driver CHECK (status IN ('ONLINE', 'OFFLINE'));

--- Add table vehicle_types ---
CREATE TABLE IF NOT EXISTS public.vehicle_types(
    vehicle_type_id SERIAL PRIMARY KEY,
    vehicle_name VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- Add FOREIGN KEY
ALTER TABLE public.drivers DROP CONSTRAINT IF EXISTS fk_drivers_vehicle_types;

ALTER TABLE public.drivers
    ADD CONSTRAINT fk_drivers_vehicle_types FOREIGN KEY (vehicle_type_id) REFERENCES public.vehicle_types (vehicle_type_id);

INSERT INTO public.vehicle_types (vehicle_name)
VALUES ('Taxi 4 seats'), ('Taxi 7 seats'), ('Taxi 16 seats'), ('Taxi 29 seats'), ('Taxi 45 seats');

INSERT INTO public.drivers (user_id, vehicle_type_id, status)
VALUES (3, 1, 'ONLINE');
