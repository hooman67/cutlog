-- Create waitlist table for beta sign-ups
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  machine_type text,
  application_type text,
  interested_in_updates boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.waitlist enable row level security;

-- Allow anonymous inserts (for signup form)
create policy "Allow anonymous inserts on waitlist" on public.waitlist
  for insert
  with check (true);

-- Allow anonymous reads on waitlist (for position count)
create policy "Allow anonymous reads on waitlist" on public.waitlist
  for select
  with check (true);

-- Create an index on email for faster lookups
create index idx_waitlist_email on public.waitlist(email);

-- Create an index on created_at for chronological ordering
create index idx_waitlist_created_at on public.waitlist(created_at);
