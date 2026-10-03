-- LOVELY: table de cadeaux
create table if not exists public.gifts (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.gifts enable row level security;

-- Pour la démo publique : lecture/écriture via la clé anon.
-- En production, ajoute une authentification et des politiques plus strictes.
create policy "lovely public insert"
on public.gifts for insert
to anon
with check (true);

create policy "lovely public read"
on public.gifts for select
to anon
using (true);
