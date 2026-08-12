/*
# Add must_change_password column to profiles

1. Changes to existing tables
- `profiles`: adds `must_change_password boolean NOT NULL DEFAULT false` column.
  When a new user signs up, this stays false. When an admin creates an account with
  a temporary password, it is set to true so the user is forced to change it on first login.

2. Trigger update
- Updates `handle_new_user()` to also set `must_change_password = false` on new signups.

3. Security
- No RLS policy changes needed — the column is user-readable and user-writable only
  for their own profile (already covered by existing profiles_update_own policy).
*/

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS must_change_password boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role, status, must_change_password)
  VALUES (
    NEW.id, NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'doctor'),
    'pending',
    false
  );
  RETURN NEW;
END;
$$;
