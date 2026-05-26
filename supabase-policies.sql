-- Ejecuta este archivo en Supabase > SQL Editor.
-- Permite que la app publica lea e inserte consultas y pagos usando la anon key.

alter table public.consultas enable row level security;
alter table public.pagos enable row level security;

drop policy if exists "consultas_select_public" on public.consultas;
drop policy if exists "consultas_insert_public" on public.consultas;
drop policy if exists "pagos_select_public" on public.pagos;
drop policy if exists "pagos_insert_public" on public.pagos;

create policy "consultas_select_public"
on public.consultas
for select
to anon
using (true);

create policy "consultas_insert_public"
on public.consultas
for insert
to anon
with check (true);

create policy "pagos_select_public"
on public.pagos
for select
to anon
using (true);

create policy "pagos_insert_public"
on public.pagos
for insert
to anon
with check (true);
