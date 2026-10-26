-- Run in Supabase SQL Editor. Public SELECT only; no anonymous writes.
create table if not exists public.players (
 id bigint generated always as identity primary key,
 full_name text not null unique, shirt_number integer, position text,
 nationality text, squad_group text default 'First Team', bio text,
 photo_url text, birth_date date, preferred_foot text, height_cm integer,
 joined_on date, appearances integer, goals integer, assists integer,
 minutes_played integer, source_names text[] default '{}', verified boolean default false,
 updated_at timestamptz default now()
);
create table if not exists public.matches (
 id bigint generated always as identity primary key,
 kickoff_at timestamptz, competition text, season text, home_team text not null,
 away_team text not null, home_score integer, away_score integer,
 status text, venue text, source_url text, verified boolean default false,
 updated_at timestamptz default now()
);
create table if not exists public.standings (
 id bigint generated always as identity primary key,
 competition text not null, season text not null, rank integer,
 team_name text not null, played integer, won integer, drawn integer,
 lost integer, goal_difference integer, points integer,
 source_url text, updated_at timestamptz default now(),
 unique(competition,season,team_name)
);
create table if not exists public.articles (
 id bigint generated always as identity primary key,
 title text not null, summary text, published_at timestamptz,
 source_url text, updated_at timestamptz default now()
);
create table if not exists public.club_history (
 id bigint generated always as identity primary key,
 event_date date, title text not null, description text, source_url text,
 updated_at timestamptz default now()
);
alter table public.players enable row level security;
alter table public.matches enable row level security;
alter table public.standings enable row level security;
alter table public.articles enable row level security;
alter table public.club_history enable row level security;
do $$ declare tbl text; begin
 foreach tbl in array array['players','matches','standings','articles','club_history'] loop
  execute format('drop policy if exists "public read" on public.%I',tbl);
  execute format('create policy "public read" on public.%I for select to anon, authenticated using (true)',tbl);
 end loop;
end $$;
-- Intentionally no fabricated seed data. Add verified rows via dashboard.
