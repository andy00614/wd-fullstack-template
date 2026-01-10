---
name: systematic-debugging
description: Use when encountering any bug, test failure, or unexpected behavior. Enforces root cause investigation before attempting fixes. Prevents guess-and-check debugging.
---

# Systematic Debugging

## Iron Law

```
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
```

Random patches mask underlying issues and create new problems. Systematic investigation resolves issues faster than guess-and-check.

## Four-Phase Process

### Phase 1: Root Cause Investigation

1. **Read error messages carefully** - Full stack traces, not just first line
2. **Reproduce consistently** - If you can't reproduce, you can't verify fix
3. **Review recent changes** - `git diff`, `git log --oneline -10`
4. **Add diagnostic instrumentation** - Console logs at boundaries
5. **Trace data flow backwards** - Find where bad values originate

```typescript
// Add instrumentation at boundaries
console.log('[DEBUG] Input:', JSON.stringify(input, null, 2));
console.log('[DEBUG] After transform:', result);
console.log('[DEBUG] API response:', response.status, response.data);
```

### Phase 2: Pattern Analysis

1. **Find similar working code** - Same pattern elsewhere in codebase?
2. **Read reference implementations completely** - Don't skim
3. **List every difference** - Between working and broken code
4. **Understand dependencies** - What does this code assume?

```bash
# Find similar patterns
grep -r "similar_function" src/
# Check how others use this API
grep -r "createClient" src/
```

### Phase 3: Hypothesis and Testing

1. **State specific hypothesis** - "The bug occurs because X when Y"
2. **Design minimal test** - Single-variable change
3. **Predict outcome** - What should happen if hypothesis correct?
4. **Execute and observe** - Don't assume, verify
5. **If wrong, form NEW hypothesis** - Don't compound fixes

```typescript
// GOOD: Single hypothesis test
// Hypothesis: The date is being parsed in wrong timezone
console.log('Raw date string:', dateStr);
console.log('Parsed date:', new Date(dateStr));
console.log('Expected:', expectedDate);

// BAD: Multiple changes at once
// Changed timezone AND format AND validation - which fixed it?
```

### Phase 4: Implementation

1. **Write failing test first** - Captures the bug
2. **Implement single targeted fix** - Root cause only
3. **Verify solution** - Test passes, no regressions
4. **Clean up diagnostics** - Remove console.logs

```typescript
// 1. Failing test
test('handles empty array input', () => {
  expect(() => processItems([])).not.toThrow();
  expect(processItems([])).toEqual([]);
});

// 2. Minimal fix
function processItems(items: Item[]) {
  if (!items.length) return []; // Fix: handle empty array
  return items.map(transform);
}

// 3. Verify
bun run test:run
```

## Critical Escalation Rule

**After 3+ failed fix attempts: STOP.**

Don't add more patches. Question the architecture:
- Is the abstraction wrong?
- Is the data model flawed?
- Should this be redesigned?

```
3 fixes failed → Architecture problem, not bug
```

## Red Flags - You've Abandoned the Process

| Thinking | Reality |
|----------|---------|
| "Let me just try..." | You're guessing, not investigating |
| "This should fix it" | You don't have root cause |
| "One more attempt" | You're past 3, question architecture |
| Multiple simultaneous changes | Can't isolate what worked |
| "It works now" (without knowing why) | Bug will return |

## When Human Partner Redirects

If your human partner says:
- "Is that not happening?"
- "Stop guessing"
- "What's the actual error?"
- "Did you check X?"

**Return to Phase 1.** They see you've skipped investigation.

## Debugging Checklist

Before claiming "fixed":

- [ ] Can explain root cause in one sentence
- [ ] Wrote test that catches the bug
- [ ] Made single targeted change
- [ ] All tests pass
- [ ] Removed diagnostic code
- [ ] Understand why fix works

## Common Root Causes

| Symptom | Often Caused By |
|---------|-----------------|
| "undefined is not a function" | Wrong import, async timing |
| "Cannot read property of null" | Missing null check, race condition |
| Data not updating | Stale closure, missing dependency |
| Infinite loop | useEffect deps, recursive call |
| Type error at runtime | Type assertion lie, any escape |
| Works locally, fails in prod | Env vars, build config, timing |
