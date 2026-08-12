/*
# Super Admin Bootstrap

Creates a SECURITY DEFINER function to promote a user to super_admin.
This is the ONLY way to assign super_admin role — never done in frontend code.

The function checks if any super_admin already exists:
- If NO super_admin exists yet (initial bootstrap), any authenticated user can promote the first one.
- If super_admin(s) already exist, only an existing super_admin can promote others.

This ensures the first super admin (pranavvispute82@gmail.com) can be promoted
after signup, without hardcoding the email in application code.
*/

CREATE OR REPLACE FUNCTION promote_super_admin(target_email text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  target_id uuid;
  admin_exists boolean;
BEGIN
  -- Check if any super_admin already exists
  SELECT EXISTS(SELECT 1 FROM profiles WHERE role = 'super_admin') INTO admin_exists;

  -- If admins exist, only a super_admin can call this
  IF admin_exists THEN
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin') THEN
      RAISE EXCEPTION 'Only existing super admins can promote new ones';
    END IF;
  END IF;

  -- Find the target user by email
  SELECT id INTO target_id FROM profiles WHERE email = target_email;
  IF target_id IS NULL THEN
    RAISE EXCEPTION 'User not found: %', target_email;
  END IF;

  -- Promote
  UPDATE profiles SET role = 'super_admin', status = 'approved', updated_at = now()
  WHERE id = target_id;

  RETURN true;
END;
$$;

-- Also create a function to log audit entries from edge functions
CREATE OR REPLACE FUNCTION log_audit_event(
  p_user_id uuid,
  p_action text,
  p_resource text DEFAULT NULL,
  p_resource_id text DEFAULT NULL,
  p_metadata jsonb DEFAULT NULL
)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO audit_logs (user_id, action, resource, resource_id, metadata)
  VALUES (p_user_id, p_action, p_resource, p_resource_id, p_metadata);
END;
$$;
