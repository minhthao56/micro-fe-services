CREATE TABLE IF NOT EXISTS public.users(
    user_id SERIAL PRIMARY KEY,
    last_name VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    user_group VARCHAR(255) NOT NULL,
    phone_number VARCHAR(80) NOT NUL UNIQUE,
    firebase_uid VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);


-- Drop the existing constraint if it exists
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS constant_user_group;

-- Add the new CHECK constraint
ALTER TABLE public.users
ADD CONSTRAINT constant_user_group CHECK (user_group IN ('ADMIN_GROUP', 'CLIENT_GROUP', 'DRIVER_GROUP'));
