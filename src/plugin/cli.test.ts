import { describe, expect, it } from "vitest";

import {
  buildDetectedAgyLoginMessage,
  buildLoginModeFallbackPrompt,
  type ExistingAccountInfo,
} from "./cli";
import type { DetectedAgyCredentials } from "./storage";

const detectedAgyCredentials: DetectedAgyCredentials = {
  present: true,
  source: "os-keyring",
  accountLabel: "antigravity-keyring",
  requiresOnboarding: true,
};

describe("CLI login onboarding copy", () => {
  it("adds agy-safe guidance only when reusable credentials were detected", () => {
    expect(buildDetectedAgyLoginMessage()).toEqual([]);

    const result = buildDetectedAgyLoginMessage(detectedAgyCredentials);

    expect(result.join(" ")).toContain("Detected reusable agy credentials");
    expect(result.join(" ")).toContain("machine-backed access");
    expect(result.join(" ")).not.toContain("super-secret");
  });

  it("includes terminal-first next steps in fallback prompts", () => {
    const existingAccounts: ExistingAccountInfo[] = [
      {
        email: "antigravity-keyring",
        index: 0,
      },
    ];

    const prompt = buildLoginModeFallbackPrompt(existingAccounts, detectedAgyCredentials);

    expect(prompt.introLines.join(" ")).toContain("check quotas or verify account access");
    expect(prompt.introLines.join(" ")).toContain("configure models in opencode.json");
    expect(prompt.question).toContain("[a/f/c/v/va]");
  });
});
