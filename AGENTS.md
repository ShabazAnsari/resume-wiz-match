<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# Project rules
- Roles live in `public.user_roles` and are checked via `has_role()`; signup trigger only grants candidate/recruiter so admin can never be self-assigned.
- Signed-in pages live under the pathless `_app` layout (client-only gate) so protected UI never renders without a session.
- Client auth state comes from `AuthProvider` in `src/lib/auth.tsx`; components use `useAuth()` instead of calling the auth client directly.
- A mirrored Django/DRF reference backend is delivered as downloadable source (not run here) because the live runtime is TanStack Start.
