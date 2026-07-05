# Tasks: Surface detected agy credentials in auth login

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 220-340 |
| 400-line budget risk | Medium |
| Chained PRs recommended | No |
| Suggested split | single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Medium

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Detection context, CLI/UI copy, tests, docs | PR 1 | Single reviewable slice |

## Traceability

| Ref | Covered by |
|-----|------------|
| R1 Surface detected credentials | 1.1, 2.1, 2.2, 4.1 |
| R2 Honest/safe messaging | 1.1, 2.1, 3.1, 4.2 |
| R3 Terminal-first next steps | 2.1, 2.2, 3.2, 4.1 |
| R4 Fallback CLI guidance | 2.1, 3.2 |
| SC1 Login clearly tells agy users | 2.1, 2.2, 3.1 |
| SC2 Next steps are obvious | 2.1, 2.2, 3.2, 4.1 |
| SC3 Docs explain safe reuse | 4.1, 4.2 |

## Phase 1: Foundation

- [x] 1.1 In `src/plugin/storage.ts`, add and export a `DetectedAgyCredentials` summary/helper based on `readKeyring()` that reports presence only when a refresh token exists and never exposes raw secrets.
- [x] 1.2 In `src/plugin/storage.test.ts`, add focused cases for detected vs absent keyring credentials and `requiresOnboarding` behavior to lock Requirement 1 and Requirement 2 semantics.

## Phase 2: Login and onboarding wiring

- [x] 2.1 In `src/plugin/cli.ts`, extend `promptLoginMode()` and `promptLoginModeFallback()` to accept optional detected-credential context and render agy-safe guidance plus next-step hints before action selection.
- [x] 2.2 In `src/plugin/ui/auth-menu.ts`, add optional subtitle/help copy for detected agy credentials that keeps existing actions intact and points users to quota/account checks and model configuration.
- [x] 2.3 In `src/plugin.ts`, read the detection summary during `opencode auth login`, pass it into the menu/fallback prompt path, and preserve the current post-action loop so onboarding continues after non-destructive checks.

## Phase 3: Verification

- [x] 3.1 Add login-flow tests in `src/plugin/storage.test.ts` or a new `src/plugin/cli.test.ts` covering detected messaging appearing only when reusable agy access exists and staying honest about machine-backed reuse.
- [x] 3.2 Add prompt/menu tests in `src/plugin/cli.test.ts` and/or `src/plugin/ui/auth-menu.test.ts` covering terminal and fallback next-step guidance plus returning to onboarding after check/verify actions.
- [x] 3.3 Run `npm test`, then manually smoke-test `opencode auth login` with and without `gemini:antigravity` credentials to verify the spec scenarios end-to-end.

## Phase 4: Documentation

- [x] 4.1 Update `README.md` with the agy-first login path, including detected-credential messaging and the recommended follow-up actions for quota/account checks and model setup.
- [x] 4.2 Update `docs/CONFIGURATION.md` to explain that keyring-backed reuse is the safer path and that `cli_first` is optional routing behavior, not a prerequisite for login reuse.
