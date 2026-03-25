-- Enable Initial Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create Demo Buyer
INSERT INTO auth.users (
  id, 
  instance_id,
  email, 
  encrypted_password, 
  email_confirmed_at, 
  raw_app_meta_data, 
  raw_user_meta_data, 
  created_at, 
  updated_at, 
  role, 
  aud,
  confirmation_token,
  email_change,
  phone_change,
  email_change_token_current,
  email_change_token_new,
  phone_change_token,
  reauthentication_token,
  recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'buyer@demo.com',
  extensions.crypt('demo1234', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Demo Buyer","role":"buyer"}',
  now(),
  now(),
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO UPDATE SET
  email_change = EXCLUDED.email_change,
  phone_change = EXCLUDED.phone_change,
  email_change_token_current = EXCLUDED.email_change_token_current;

INSERT INTO public.profiles (id, full_name, role, phone)
VALUES ('00000000-0000-0000-0000-000000000001', 'Demo Buyer', 'buyer', '9999999991')
ON CONFLICT (id) DO NOTHING;

-- Create Demo Owner
INSERT INTO auth.users (
  id, 
  instance_id,
  email, 
  encrypted_password, 
  email_confirmed_at, 
  raw_app_meta_data, 
  raw_user_meta_data, 
  created_at, 
  updated_at, 
  role, 
  aud,
  confirmation_token,
  email_change,
  phone_change,
  email_change_token_current,
  email_change_token_new,
  phone_change_token,
  reauthentication_token,
  recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000000',
  'owner@demo.com',
  extensions.crypt('demo1234', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Demo Owner","role":"owner"}',
  now(),
  now(),
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO UPDATE SET
  email_change = EXCLUDED.email_change,
  phone_change = EXCLUDED.phone_change,
  email_change_token_current = EXCLUDED.email_change_token_current;

INSERT INTO public.profiles (id, full_name, role, phone)
VALUES ('00000000-0000-0000-0000-000000000002', 'Demo Owner', 'owner', '9999999992')
ON CONFLICT (id) DO NOTHING;

-- Create Demo Admin
INSERT INTO auth.users (
  id, 
  instance_id,
  email, 
  encrypted_password, 
  email_confirmed_at, 
  raw_app_meta_data, 
  raw_user_meta_data, 
  created_at, 
  updated_at, 
  role, 
  aud,
  confirmation_token,
  email_change,
  phone_change,
  email_change_token_current,
  email_change_token_new,
  phone_change_token,
  reauthentication_token,
  recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000000',
  'admin@demo.com',
  extensions.crypt('demo1234', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Demo Admin","role":"admin"}',
  now(),
  now(),
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO UPDATE SET
  email_change = EXCLUDED.email_change,
  phone_change = EXCLUDED.phone_change,
  email_change_token_current = EXCLUDED.email_change_token_current;

INSERT INTO public.profiles (id, full_name, role, phone)
VALUES ('00000000-0000-0000-0000-000000000003', 'Demo Admin', 'admin', '9999999993')
ON CONFLICT (id) DO NOTHING;
