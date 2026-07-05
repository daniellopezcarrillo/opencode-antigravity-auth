# Proposal: Surface detected agy credentials in auth login

## Intent

Improve `opencode auth login` for terminal-first agy users by clearly surfacing when existing `agy` credentials are already available, guiding the next CLI-safe steps, and reducing unnecessary re-auth. This improves integration with the native agy workflow and lowers security risk by favoring keyring-backed reuse over ad hoc token handling.

## Scope

### In Scope
- Detect and display when `agy` keyring credentials are available during `opencode auth login`.
- Add CLI-first onboarding copy and actions that explain reuse of agy credentials, model setup, and quota/check flows.
- Document the terminal-first onboarding path in README/config docs with security guidance.

### Out of Scope
- New raw token import/export commands.
- Freeform header, user-agent, or fingerprint customization.

## Capabilities

### New Capabilities
- `agy-cli-onboarding`: Safe discovery and onboarding flow for users who already authenticate through the native agy CLI.

### Modified Capabilities
- None.

## Approach

Plumb a small credential-detection status from storage into the login/menu flow, then present a concise agy-aware message and next actions inside the existing TTY and fallback CLI UX. Keep request routing unchanged: reuse the current keyring import path, expose safer onboarding copy, and point users to existing config/model helpers instead of exposing sensitive transport controls.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/plugin/storage.ts` | Modified | Expose detected agy credential presence/metadata for login UX. |
| `src/plugin/cli.ts` | Modified | Show agy-aware login guidance and next-step prompts. |
| `src/plugin/ui/auth-menu.ts` | Modified | Add terminal-first labels/help text for detected agy auth. |
| `README.md` | Modified | Document agy-first onboarding path. |
| `docs/CONFIGURATION.md` | Modified | Clarify recommended safe config for agy users. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Users think credentials are copied insecurely | Med | Explicitly state credentials stay in OS keyring and are only reused. |
| Onboarding copy overpromises login readiness | Low | Only show detected state when keyring refresh token is actually present. |

## Rollback Plan

Revert the login/menu messaging and detection plumbing, preserving the existing silent keyring import behavior and documentation.

## Dependencies

- Existing `readKeyring()` support for `gemini:antigravity` credentials.

## Success Criteria

- [ ] `opencode auth login` clearly tells agy users when reusable credentials are detected.
- [ ] Terminal-first users can reach model setup and quota/account checks without guessing the next step.
- [ ] Docs explain the agy integration and why keyring-backed reuse is the safer path.
