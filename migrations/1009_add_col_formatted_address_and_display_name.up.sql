ALTER TABLE public.addresses ADD COLUMN formatted_address text;
ALTER TABLE public.addresses ADD COLUMN display_name text;

UPDATE addresses
SET formatted_address = name;
ALTER TABLE addresses DROP COLUMN name;