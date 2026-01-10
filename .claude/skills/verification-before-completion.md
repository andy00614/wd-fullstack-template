---
name: verification-before-completion
description: Enforces verification of all claims before marking work complete. No completion claims without fresh evidence. Use before committing or claiming tasks done.
---

# Verification Before Completion

## Iron Law

```
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
```

Evidence before claims, always. Skipping steps is dishonesty, not efficiency.

## The Gate

Before claiming ANY work status, follow this process:

```
1. IDENTIFY → What command verifies this claim?
2. RUN      → Execute the command freshly
3. READ     → Check full output and exit codes
4. VERIFY   → Does output confirm the claim?
5. CLAIM    → Only then make the claim with evidence
```

## Prohibited Claims

Never claim these without evidence:

| Claim | Required Evidence |
|-------|-------------------|
| "Tests pass" | Test output showing 0 failures |
| "Linter clean" | Lint output with no errors |
| "Build succeeds" | Build command with exit code 0 |
| "Bug fixed" | Reproduction steps no longer fail |
| "Types correct" | `typecheck` passing |
| "Feature works" | Screenshot or test proving it |

## Verification Commands

```bash
# Types
bun run typecheck

# Lint + Format
bun run check

# Unit Tests
bun run test:run

# All Quality Checks
bun run validate

# E2E Tests
bun run e2e

# Single Test File
bun run test:run src/modules/posts/schemas.test.ts
```

## Red Flags

You're skipping verification if you:

- Use hedging: "should work", "probably fine", "I think it passes"
- Express satisfaction before running commands
- Trust previous run results instead of fresh runs
- Claim success without showing output
- Say "it worked when I tried it"

## Example: Correct Flow

```
Task: Fix validation bug in createPost

1. Write failing test
   → Run: bun run test:run
   → Output: FAIL - 1 test failed
   → Claim: "Test correctly fails"

2. Implement fix
   → Run: bun run test:run
   → Output: PASS - all tests passed
   → Claim: "Fix verified, tests pass"

3. Check for regressions
   → Run: bun run validate
   → Output: All checks passed
   → Claim: "Ready to commit"
```

## Before Commit Checklist

Run ALL of these. Do not skip.

```bash
# 1. Types
bun run typecheck
# Expected: No errors

# 2. Lint
bun run check
# Expected: No errors (scripts/ warnings ok)

# 3. Tests
bun run test:run
# Expected: All tests pass

# 4. E2E (if UI changed)
bun run e2e
# Expected: All tests pass
```

Only after all pass with fresh output:

```bash
git add .
git commit -m "feat: description"
```

## Rationalizations to Reject

| Excuse | Reality |
|--------|---------|
| "I'm confident" | Confidence ≠ evidence |
| "I ran it earlier" | State changes. Run again. |
| "Just a small change" | Small changes break things |
| "Tests are slow" | Slower than debugging prod? |
| "I'll check later" | Later never comes |

## Final Rule

```
Run the command.
Read the output.
THEN claim the result.

This is non-negotiable.
```
