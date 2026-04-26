create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists games (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  team_id uuid references teams(id) on delete cascade,
  opponent_name text,
  game_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  team_id uuid references teams(id) on delete cascade,
  number text,
  first_name text,
  last_name text,
  pronunciation text,
  position text,
  class_year text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists player_stats (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  player_id uuid references players(id) on delete cascade,
  season text,
  stats jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (player_id, season)
);

create table if not exists game_lineups (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  game_id uuid references games(id) on delete cascade,
  player_id uuid references players(id) on delete set null,
  batting_order int not null check (batting_order between 1 and 9),
  position text,
  created_at timestamptz not null default now(),
  unique (game_id, batting_order)
);

create table if not exists game_events (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  game_id uuid references games(id) on delete cascade,
  player_id uuid references players(id) on delete set null,
  result text not null,
  rbi int not null default 0,
  sb int not null default 0,
  cs int not null default 0,
  context text,
  created_at timestamptz not null default now()
);

create table if not exists source_files (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  team_id uuid references teams(id) on delete cascade,
  game_id uuid references games(id) on delete set null,
  file_name text not null,
  file_type text not null,
  detail text,
  storage_path text,
  imported_at timestamptz not null default now()
);

alter table teams enable row level security;
alter table games enable row level security;
alter table players enable row level security;
alter table player_stats enable row level security;
alter table game_lineups enable row level security;
alter table game_events enable row level security;
alter table source_files enable row level security;

create policy "Users manage their own teams" on teams
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "Users manage their own games" on games
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "Users manage their own players" on players
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "Users manage their own player stats" on player_stats
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "Users manage their own lineups" on game_lineups
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "Users manage their own events" on game_events
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "Users manage their own source files" on source_files
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
