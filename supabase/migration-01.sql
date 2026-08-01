-- Run this if you already ran the first version of schema.sql.
-- Adds the invoice-document columns (itemized lines, numbers, dates) the app stores.
-- Safe to run more than once.

alter table invoices add column if not exists num text;
alter table invoices add column if not exists addr text;
alter table invoices add column if not exists service text;
alter table invoices add column if not exists issued text;
alter table invoices add column if not exists due text;
alter table invoices add column if not exists reminded text;
alter table invoices add column if not exists tax numeric default 0;
alter table invoices add column if not exists lines jsonb not null default '[]';

-- Quote-document columns (project title, issue/expiry dates, deposit %).
alter table quotes add column if not exists title text;
alter table quotes add column if not exists issued text;
alter table quotes add column if not exists expires text;
alter table quotes add column if not exists deposit_pct numeric default 50;
