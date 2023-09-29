CREATE TABLE IF NOT EXISTS public.users(
    user_id UUID PRIMARY KEY,
    last_name VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NULL,
    user_group VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Assuming you've already created the 'public.users' table

INSERT INTO public.users (user_id, last_name, first_name, username, email, user_group)
VALUES ('aaa3ff4b-58aa-4a07-a4cc-a14fadc4a20e', 'Minh', 'Thao', 'minhthao56', 'minhthao5648+admin@gmail.com', 'admin');
