-- مخطط اختياري للمرحلة التالية (Supabase / PostgreSQL)
-- فعّل Supabase Auth قبل استخدام هذه الجداول في موقع منشور.
create extension if not exists pgcrypto;

create table if not exists public.marketing_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  customer_name text not null,
  contact_method text not null,
  service_type text not null,
  platform text not null check (platform in ('Facebook','Instagram','TikTok','الكل')),
  details text default '',
  status text not null default 'new' check (status in ('new','reviewing','completed','cancelled')),
  created_at timestamptz not null default now()
);

alter table public.marketing_requests enable row level security;

create policy "Users can view own requests"
on public.marketing_requests for select
using (auth.uid() = user_id);

create policy "Users can create own requests"
on public.marketing_requests for insert
with check (auth.uid() = user_id);

create policy "Users can update own requests"
on public.marketing_requests for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- لا تضع مفاتيح API أو access tokens في هذا الجدول أو في الواجهة.
-- استخدم خادماً/Edge Function لحفظ أسرار OAuth والتعامل مع المنصات.
