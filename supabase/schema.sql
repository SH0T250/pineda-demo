-- Pineda OS — Supabase schema. Paste into Supabase SQL Editor and run once.
-- Auth uses Supabase's built-in auth.users; role/name live in user_metadata.
-- Already ran the first version? Run migration-01.sql instead of this file.

create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  time text, client text not null, task text, tech text, addr text,
  parts text, rev numeric default 0, profit numeric default 0,
  done boolean default false, ai_booked boolean default false
);

create table if not exists quotes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  num text, client text not null, addr text,
  status text not null default 'draft', -- draft | sent | won | lost
  lines jsonb not null default '[]',
  title text, issued text, expires text, deposit_pct numeric default 50
);

create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  client text not null, amt numeric not null default 0,
  status text not null default 'SENT', -- OVERDUE | SENT | VIEWED | PAID
  tone text default 'amber',
  num text, addr text, service text,
  issued text, due text, reminded text,
  tax numeric default 0,
  lines jsonb not null default '[]'
);

create table if not exists parts (
  id uuid primary key default gen_random_uuid(),
  item text not null, vendor text, pn text,
  cost numeric not null default 0, markup_pct numeric not null default 0
);

create table if not exists assets (
  id uuid primary key default gen_random_uuid(),
  name text not null, tag text, value numeric default 0,
  status text default 'ON TRUCK', tone text default 'green'
);

-- Row Level Security: signed-in users read/write everything (single-company app).
alter table jobs enable row level security;
alter table quotes enable row level security;
alter table invoices enable row level security;
alter table parts enable row level security;
alter table assets enable row level security;

do $$
declare t text;
begin
  foreach t in array array['jobs','quotes','invoices','parts','assets'] loop
    if not exists (select 1 from pg_policies where tablename = t and policyname = 'auth all') then
      execute format('create policy "auth all" on %I for all to authenticated using (true) with check (true)', t);
    end if;
  end loop;
end $$;
