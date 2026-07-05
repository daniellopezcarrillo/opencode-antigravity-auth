# Design: Surface detected agy credentials in auth login

## Technical Approach

Expose a small, explicit `agy` credential-detection summary from storage, thread it into the existing `opencode auth login` menu/prompt flow, and document the CLI-first path in user docs. This stays aligned with the proposal/spec by reusing the current keyring import path in `src/plugin/storage.ts` and only adding UX-visible metadata plus onboarding copy.

## Architecture Decisions

| Decision | Choice | Alternatives considered | Rationale |
|---|---|---|---|
| Keyring presence detection | Add a storage-level detection helper/metadata shape derived from the existing `readKeyring()` path | Re-scan the OS keyring directly from `plugin.ts` or `cli.ts`; infer detection from injected pseudo-account label | Storage already owns keyring access and dedupe rules. Keeping detection there avoids duplicating platform logic and lets UI consume a stable, testable summary instead of parsing account internals. |
| CLI prompt integration | Extend `promptLoginMode()` / fallback prompt inputs to accept optional detected-credential context and render agy-specific guidance before action selection | Add a brand-new onboarding command; auto-run configuration without prompting | The login flow already branches through `plugin.ts` → `promptLoginMode()` → `showAuthMenu()`. Adding contextual messaging preserves current navigation, works in TTY and fallback modes, and avoids surprising users with destructive or implicit actions. |
| Scope of change | UI/storage metadata + docs only; no transport/request-routing changes | Add new auth transports, raw token import/export, header/fingerprint controls, or request-path branching | The existing transport stack already reads and uses the same refresh token through `loadAccounts()`, account management, and request routing. The problem is DISCOVERY and onboarding clarity, not missing auth capability. Transport changes would increase blast radius across OAuth, quota rotation, and request interception without improving the core user outcome. |

## Data Flow

```text
OS keyring (gemini:antigravity)
        |
        v
readKeyring() / storage detection
        |
        v
loadAccounts() + detected agy summary
        |
        v
plugin.ts login bootstrap
        |
        +--> promptLoginModeFallback() plain-text guidance
        |
        \--> showAuthMenu() / auth-menu subtitle + actions
                 |
                 v
          Existing actions: add, check quotas, verify, configure models
```

The detection message MUST be informational only: “existing machine-backed agy access was detected and can be reused.” It must not claim the user is fully configured, because model setup and quota/account checks may still be needed.

## File Changes

| File | Action | Description |
|---|---|---|
| `openspec/changes/surface-agy-credentials-cli-onboarding/design.md` | Create | Technical design artifact for this change. |
| `src/plugin/storage.ts` | Modify | Add exported detection metadata/helper near existing keyring logic so callers can distinguish “detected agy credentials” from ordinary saved accounts. |
| `src/plugin.ts` | Modify | Read the detection summary during login bootstrap and pass it into CLI/menu prompts. |
| `src/plugin/cli.ts` | Modify | Render pre-menu agy guidance in both TTY and fallback flows and preserve existing actions. |
| `src/plugin/ui/auth-menu.ts` | Modify | Add optional subtitle/help text for detected agy credentials and terminal-first next steps. |
| `src/plugin/storage.test.ts` | Modify | Cover detection metadata and non-overpromising behavior when keyring data is absent/present. |
| `README.md` | Modify | Document the agy-first login path and point users to “Configure models” / quota checks after detection. |
| `docs/CONFIGURATION.md` | Modify | Clarify recommended safe config for agy users, especially that `cli_first` is optional routing behavior, not required for login reuse. |

## Interfaces / Contracts

```ts
export interface DetectedAgyCredentials {
  present: boolean
  source: "os-keyring"
  accountLabel: string
  requiresOnboarding: boolean
}
```

`promptLoginMode()` and `showAuthMenu()` should accept this as optional read-only context. No auth token values are surfaced to UI layers.

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Unit | Keyring detection metadata | Mock `readKeyring()` inputs in `storage.test.ts`; assert presence only when refresh token exists. |
| Unit | CLI copy branching | Add focused tests for TTY/fallback prompt builders so agy messaging appears only when context is present. |
| Integration | Login bootstrap wiring | Verify `plugin.ts` passes detection context into menu/prompt flow without changing existing account-management actions. |
| E2E | Manual smoke test | Run `opencode auth login` with and without `gemini:antigravity` credentials and confirm docs-linked next steps remain accurate. |

## Migration / Rollout

No migration required. Existing storage and transport behavior stay intact; only additional metadata and copy are introduced.

## Open Questions

- [ ] Should the UI label remain generic (`antigravity-keyring`) internally while showing friendlier user-facing copy like “agy credentials detected”?
- [ ] Do we want a dedicated “Check account status” label in the menu, or should we keep the existing “Check quotas” wording and explain account verification in surrounding copy?
