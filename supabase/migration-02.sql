-- Air Filter section — one row per filter LOCATION (not per home).
-- Change log lives on the row as jsonb; tech-verified entries carry a tech name.
-- Safe to run more than once.

create table if not exists filters (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nickname text, system text,
  nominal text, actual text, thickness text, ftype text,
  merv numeric, brand text, pn text, qty numeric default 1,
  base_days numeric default 60,
  modifiers jsonb not null default '[]',
  interval_days numeric default 60,
  since_changed numeric default 0,
  last_changed_label text,
  source text, confidence text,
  arrow text, keep_on_hand text,
  log jsonb not null default '[]'
);

alter table filters enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'filters' and policyname = 'auth all') then
    create policy "auth all" on filters for all to authenticated using (true) with check (true);
  end if;
end $$;
