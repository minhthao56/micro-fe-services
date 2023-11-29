CREATE TABLE IF NOT EXISTS public.notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE,
    title TEXT,
    body TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES public.users (user_id)
);