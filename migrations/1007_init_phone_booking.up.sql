CREATE TABLE IF NOT EXISTS public.phone_booking(
    phone_booking_id SERIAL NOT NULL PRIMARY KEY,
    start_recording_url VARCHAR(255),
    end_recording_url VARCHAR(255),
    call_sid VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(255),
    customer_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP
);

ALTER TABLE public.phone_booking DROP CONSTRAINT IF EXISTS status_phone_booking;

ALTER TABLE public.phone_booking
    ADD CONSTRAINT status_phone_booking CHECK (status IN ('PENDING', 'CANCELED', 'COMPLETED'));
