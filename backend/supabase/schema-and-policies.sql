-- Vental Supabase schema and RLS policies.
-- Run this once in the Supabase SQL editor for the configured project.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  full_name text,
  email text unique,
  phone text,
  role text not null default 'user' check (role in ('user', 'admin')),
  status text not null default 'ACTIVE',
  verification text not null default 'PENDING DOC',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  vehicle_id uuid,
  full_name text not null,
  email text not null,
  phone text,
  license_id text,
  documentation text,
  pickup_date date not null,
  return_date date not null,
  subtotal numeric(12,2) not null default 0,
  taxes numeric(12,2) not null default 0,
  deposit numeric(12,2) not null default 0,
  total_price numeric(12,2) not null default 0,
  status text not null default 'pending',
  payment_status text not null default 'unpaid',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bookings_valid_dates check (return_date >= pickup_date)
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  payment_code text unique,
  booking_id uuid references public.bookings(id) on delete cascade,
  customer_name text,
  customer_email text,
  method text not null,
  amount numeric(12,2) not null default 0,
  status text not null default 'pending',
  transaction_id text unique,
  gateway_reference text,
  notes text,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_profiles_updated_at on public.profiles;
create trigger touch_profiles_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

drop trigger if exists touch_bookings_updated_at on public.bookings;
create trigger touch_bookings_updated_at
before update on public.bookings
for each row execute function public.touch_updated_at();

drop trigger if exists touch_payments_updated_at on public.payments;
create trigger touch_payments_updated_at
before update on public.payments
for each row execute function public.touch_updated_at();

create or replace function public.is_admin(check_user_id uuid default auth.uid())
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = check_user_id
      and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.bookings enable row level security;
alter table public.payments enable row level security;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
on public.profiles for select
to authenticated
using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles for insert
to authenticated
with check (id = auth.uid() and role = 'user');

drop policy if exists "profiles_update_own_limited_or_admin" on public.profiles;
create policy "profiles_update_own_limited_or_admin"
on public.profiles for update
to authenticated
using (id = auth.uid() or public.is_admin())
with check (
  public.is_admin()
  or (id = auth.uid() and role = 'user')
);

drop policy if exists "profiles_admin_delete" on public.profiles;
create policy "profiles_admin_delete"
on public.profiles for delete
to authenticated
using (public.is_admin());

drop policy if exists "bookings_select_own_or_admin" on public.bookings;
create policy "bookings_select_own_or_admin"
on public.bookings for select
to authenticated
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "bookings_insert_own" on public.bookings;
create policy "bookings_insert_own"
on public.bookings for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "bookings_update_own_unpaid_or_admin" on public.bookings;
create policy "bookings_update_own_unpaid_or_admin"
on public.bookings for update
to authenticated
using (user_id = auth.uid() or public.is_admin())
with check (
  public.is_admin()
  or (user_id = auth.uid() and payment_status in ('unpaid', 'pending'))
);

drop policy if exists "bookings_admin_delete" on public.bookings;
create policy "bookings_admin_delete"
on public.bookings for delete
to authenticated
using (public.is_admin());

drop policy if exists "payments_select_own_or_admin" on public.payments;
create policy "payments_select_own_or_admin"
on public.payments for select
to authenticated
using (
  public.is_admin()
  or exists (
    select 1
    from public.bookings b
    where b.id = payments.booking_id
      and b.user_id = auth.uid()
  )
);

drop policy if exists "payments_admin_update" on public.payments;
create policy "payments_admin_update"
on public.payments for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "payments_admin_delete" on public.payments;
create policy "payments_admin_delete"
on public.payments for delete
to authenticated
using (public.is_admin());

-- Payment inserts are intentionally service-role only.
-- The Express backend writes payment rows after card-demo confirmation or Khalti verification.

do $$
begin
  if to_regclass('public.vehicles') is not null then
    execute 'alter table public.vehicles enable row level security';

    execute 'drop policy if exists "vehicles_public_select" on public.vehicles';
    execute 'create policy "vehicles_public_select" on public.vehicles for select to anon, authenticated using (true)';

    execute 'drop policy if exists "vehicles_admin_insert" on public.vehicles';
    execute 'create policy "vehicles_admin_insert" on public.vehicles for insert to authenticated with check (public.is_admin())';

    execute 'drop policy if exists "vehicles_admin_update" on public.vehicles';
    execute 'create policy "vehicles_admin_update" on public.vehicles for update to authenticated using (public.is_admin()) with check (public.is_admin())';

    execute 'drop policy if exists "vehicles_admin_delete" on public.vehicles';
    execute 'create policy "vehicles_admin_delete" on public.vehicles for delete to authenticated using (public.is_admin())';
  end if;
end $$;
