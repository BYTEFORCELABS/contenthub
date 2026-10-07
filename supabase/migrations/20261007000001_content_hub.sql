-- Cyberzik Content Hub: initial schema.
-- Each record keeps its full shape in `data` (jsonb), so the app's content can
-- change shape freely without a migration. The app talks to these tables only
-- from its own server (secret key), after checking the signed-in email against
-- `members`. The public Data API is switched off for every table.

create table members (
  email text primary key check (email = lower(trim(email))),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table items     (seq bigint generated always as identity, id text primary key, data jsonb not null, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table campaigns (seq bigint generated always as identity, id text primary key, data jsonb not null, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table pillars   (seq bigint generated always as identity, id text primary key, data jsonb not null, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table assets    (seq bigint generated always as identity, id text primary key, data jsonb not null, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table activity  (seq bigint generated always as identity, id text primary key, data jsonb not null, created_at timestamptz not null default now(), updated_at timestamptz not null default now());

-- Lock the Data API: row level security on, no policies, no rights for the API roles.
do $$
declare t record;
begin
  for t in select tablename from pg_tables where schemaname = 'public' loop
    execute format('alter table public.%I enable row level security', t.tablename);
  end loop;
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke all on all tables in schema public from anon, authenticated;
    revoke all on all sequences in schema public from anon, authenticated;
    revoke all on all functions in schema public from anon, authenticated;
    alter default privileges in schema public revoke all on tables from anon, authenticated;
    alter default privileges in schema public revoke all on sequences from anon, authenticated;
    alter default privileges in schema public revoke all on functions from anon, authenticated;
  end if;
end $$;

-- Who may sign in. Add teammates with: insert into members (email) values ('name@example.com');
insert into members (email) values ('isaac@symphome.com');

-- The five starting content pillars (editable in the app under Settings).
insert into pillars (id, data) values
  ('technology', '{"id":"technology","name":"Technology","tone":"tech","topics":["Web development","AI","Cybersecurity","Software","Cloud"]}'),
  ('education',  '{"id":"education","name":"Education","tone":"edu","topics":["Tutorials","Business tips","Digital literacy","Technology education"]}'),
  ('cyberzik',   '{"id":"cyberzik","name":"Cyberzik","tone":"brand","topics":["Company","Team","Behind the scenes","Projects","Culture"]}'),
  ('business',   '{"id":"business","name":"Business","tone":"biz","topics":["Digital transformation","Entrepreneurship","Business technology"]}'),
  ('promotion',  '{"id":"promotion","name":"Promotion","tone":"promo","topics":["Services","Case studies","Testimonials","Offers","Calls to action"]}');
