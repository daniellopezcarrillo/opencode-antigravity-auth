# Archive Report: Surface detected agy credentials in CLI onboarding

## Status: COMPLETED

**Change**: surface-agy-credentials-cli-onboarding
**Archived**: 2026-07-05
**Verify verdict**: PASS

## Summary

Surfaced detected `agy` keyring credentials through the `opencode auth login` flow with honest, terminal-first onboarding messaging. Users who already authenticate through the native `agy` CLI now see clear guidance about credential reuse, next-step actions (quota checks, model setup), and security posture — without any changes to transport or request routing.

## Artifacts

| Artifact | Path |
|----------|------|
| Proposal | `openspec/changes/surface-agy-credentials-cli-onboarding/proposal.md` |
| Spec | `openspec/changes/surface-agy-credentials-cli-onboarding/specs/agy-cli-onboarding/spec.md` |
| Design | `openspec/changes/surface-agy-credentials-cli-onboarding/design.md` |
| Tasks | `openspec/changes/surface-agy-credentials-cli-onboarding/tasks.md` |
| Verify Report | `openspec/changes/surface-agy-credentials-cli-onboarding/verify-report.md` |
| Archive Report | `openspec/changes/surface-agy-credentials-cli-onboarding/archive-report.md` |

## Implementation Files Changed

| File | Change |
|------|--------|
| `src/plugin/storage.ts` | Added `DetectedAgyCredentials` interface, `summarizeDetectedAgyCredentials()` helper |
| `src/plugin/cli.ts` | Extended `promptLoginMode()`/`promptLoginModeFallback()` with agy-aware guidance |
| `src/plugin/ui/auth-menu.ts` | Added detected-credentials subtitle/help copy via `buildAuthMenuCopy()` |
| `src/plugin.ts` | Wired detection context into `opencode auth login` flow |
| `src/plugin/storage.test.ts` | Unit tests for detection helpers |
| `src/plugin/ui/auth-menu.test.ts` | Unit tests for menu UI copy |
| `src/plugin/cli.test.ts` | New unit tests for CLI messaging |
| `docs/CONFIGURATION.md` | Updated agy-first reuse flow documentation |
| `README.md` | Updated with agy detection feature |

## Task Completion

| Phase | Tasks | Status |
|-------|-------|--------|
| 1: Foundation | 1.1, 1.2 | ✅ Complete |
| 2: Login and onboarding wiring | 2.1, 2.2, 2.3 | ✅ Complete |
| 3: Verification | 3.1, 3.2, 3.3 | ✅ Complete |
| 4: Documentation | 4.1, 4.2 | ✅ Complete |

**Total**: 10/10 tasks complete

## Verification Results

- **Tests**: 991 passed / 0 failed / 25 skipped (1016 total)
- **Build**: Passed
- **Spec compliance**: 6/7 scenarios fully compliant, 1 partial (manual smoke test)
- **Issues**: No CRITICAL, no WARNING (one advisory about integration test coverage for interactive auth loop)

## Requirements Traceability

| Requirement | Status |
|-------------|--------|
| R1: Surface detected agy credentials | ✅ Implemented and tested |
| R2: Honest and safe messaging | ✅ Implemented and tested |
| R3: Terminal-first next steps | ✅ Implemented and tested |
| R4: Fallback CLI guidance | ✅ Implemented and tested |

## Risks Realized

None. Both identified risks (users thinking credentials are copied insecurely; onboarding copy overpromising readiness) were mitigated by design — copy explicitly states credentials stay in OS keyring, and detection only fires when a refresh token is actually present.

## Lessons Learned

- Detection-only changes (no transport modifications) are low-risk and easy to verify
- Colocated test files (`cli.test.ts` next to `cli.ts`) keep the feedback loop tight
- Interactive auth loops are hard to unit-test comprehensively; integration/smoke tests fill the gap
