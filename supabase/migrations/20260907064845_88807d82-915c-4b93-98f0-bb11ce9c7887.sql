-- Restrict profile reads to the owner only
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Revoke public execute on SECURITY DEFINER functions (none are called via the API)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.increment_votes(uuid) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.decrement_votes(uuid) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.award_report_points() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.award_resolve_points() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.award_vote_points() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.update_civic_level() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, public;