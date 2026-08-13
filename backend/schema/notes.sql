create table public.notes (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  title text not null,
  content text not null,
  completed boolean not null default false,
  is_public boolean not null default false,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  category text null default 'Work'::text,
  priority text null default 'Medium'::text,
  is_deleted boolean null default false,
  constraint notes_pkey primary key (id),
  constraint notes_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_notes_user_id on public.notes using btree (user_id) TABLESPACE pg_default;

create trigger set_notes_updated_at BEFORE
update on notes for EACH row
execute FUNCTION handle_updated_at ();