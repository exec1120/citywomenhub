-- City Women Hub starter schema. Run in Supabase SQL Editor.
create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  shirt_number integer,
  position text,
  nationality text,
  squad_group text default 'First Team',
  bio text,
  source_names text[] default '{}',
  source_url text,
  source_checked_at timestamptz,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  competition text not null,
  season text,
  kickoff timestamptz,
  opponent text not null,
  home_away text,
  city_score integer,
  opponent_score integer,
  status text default 'scheduled',
  source_url text,
  updated_at timestamptz default now()
);

create table if not exists public.player_match_stats (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references public.matches(id) on delete cascade,
  player_id uuid references public.players(id) on delete cascade,
  started boolean default false,
  minutes integer,
  goals integer default 0,
  assists integer default 0,
  yellow_cards integer default 0,
  red_cards integer default 0,
  source_url text,
  unique(match_id, player_id)
);

alter table public.players enable row level security;
alter table public.matches enable row level security;
alter table public.player_match_stats enable row level security;

-- Public read access for a public fan database; only trusted server/admin should write.
create policy "Public can read players" on public.players for select using (true);
create policy "Public can read matches" on public.matches for select using (true);
create policy "Public can read player stats" on public.player_match_stats for select using (true);
