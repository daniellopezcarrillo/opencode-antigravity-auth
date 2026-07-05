import { describe, expect, it } from "vitest";

import { buildAuthMenuCopy } from "./auth-menu";
import type { DetectedAgyCredentials } from "../storage";

const detectedAgyCredentials: DetectedAgyCredentials = {
  present: true,
  source: "os-keyring",
  accountLabel: "antigravity-keyring",
  requiresOnboarding: true,
};

describe("auth menu onboarding copy", () => {
  it("keeps the default subtitle when no agy credentials were detected", () => {
    expect(buildAuthMenuCopy()).toEqual({
      subtitle: "Select an action or account",
    });
  });

  it("explains safe reuse and next steps when agy credentials are detected", () => {
    const copy = buildAuthMenuCopy(detectedAgyCredentials);

    expect(copy.subtitle).toContain("Detected reusable agy credentials");
    expect(copy.subtitle).toContain("machine-backed");
    expect(copy.help).toContain("Check quotas or verify access");
    expect(copy.help).toContain("configure models in opencode.json");
  });
});
