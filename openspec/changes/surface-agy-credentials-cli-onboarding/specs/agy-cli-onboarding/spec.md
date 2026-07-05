# agy-cli-onboarding Specification

## Purpose

Define how CLI login and terminal onboarding SHALL guide users who already have reusable `agy` credentials.

## Requirements

### Requirement: Surface detected agy credentials during login

The system MUST clearly tell users when reusable `agy` credentials are already available before asking them to repeat authentication.

#### Scenario: Login starts with reusable agy credentials detected

- GIVEN a user starts `opencode auth login`
- AND reusable `agy` credentials are available for the current machine
- WHEN the login flow begins
- THEN the CLI SHALL state that existing `agy` credentials were detected and can be reused

#### Scenario: Login starts without reusable agy credentials

- GIVEN a user starts `opencode auth login`
- AND reusable `agy` credentials are not available
- WHEN the login flow begins
- THEN the CLI SHALL continue without agy-specific detected-credentials messaging

### Requirement: Keep detected-credential messaging honest and safe

The system MUST describe detected `agy` credentials as reusable existing access and MUST NOT imply that credentials were exported, copied insecurely, or that all setup is already complete.

#### Scenario: Detection message explains the security posture

- GIVEN reusable `agy` credentials are detected during login
- WHEN the CLI explains the detected state
- THEN it SHALL describe the credentials as existing machine-backed access being reused
- AND it SHALL NOT describe the flow as exposing raw secrets to the user

#### Scenario: Detection does not overpromise readiness

- GIVEN reusable `agy` credentials are detected during login
- AND additional onboarding steps are still required
- WHEN the CLI presents the next step
- THEN it SHALL guide the user to the remaining setup instead of claiming login is fully complete

### Requirement: Provide terminal-first onboarding next steps

The system SHALL provide terminal-friendly onboarding actions after detected `agy` credentials are surfaced so users can continue setup without guessing the next CLI step.

#### Scenario: Terminal user receives onboarding choices

- GIVEN a user is in the interactive terminal login flow
- AND reusable `agy` credentials are detected
- WHEN onboarding guidance is shown
- THEN the terminal flow SHALL offer next steps for account or quota checking and model configuration

#### Scenario: User returns to onboarding after checking status

- GIVEN a user is in the interactive terminal onboarding flow
- AND the user completes a non-destructive next step such as checking account or quota status
- WHEN that step finishes
- THEN the terminal flow SHALL allow the user to continue onboarding without restarting login from scratch

### Requirement: Preserve onboarding guidance in fallback CLI mode

The system SHOULD preserve the same detected-credential meaning and next-step guidance when the richer terminal menu is unavailable.

#### Scenario: Non-interactive or limited terminal fallback

- GIVEN a user starts login in a CLI environment without the richer terminal menu
- AND reusable `agy` credentials are detected
- WHEN fallback login prompts are shown
- THEN the CLI SHOULD still explain the detected `agy` state and available onboarding next steps in plain prompt text
