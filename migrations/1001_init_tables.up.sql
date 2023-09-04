CREATE TABLE IF NOT EXISTS public.users(
    user_id UUID PRIMARY KEY,
    last_name VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    user_group VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO public.users (last_name, first_name, username, email, user_group)
VALUES ('Minh', 'Thao', 'MT', 'minhthao5648+admin@gmail.com', "admin");