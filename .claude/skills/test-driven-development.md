---
name: test-driven-development
description: Use when implementing any feature or bugfix. Write tests first, watch them fail, then write minimal code to pass. Enforces RED-GREEN-REFACTOR cycle.
---

# Test-Driven Development

## Iron Law

```
NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST
```

Write code before the test? Delete it. Start over. No exceptions.

## Why Order Matters

Tests written after code pass immediately. Passing immediately proves nothing:
- Might test wrong thing
- Might test implementation, not behavior
- You never saw it catch the bug

Test-first forces you to see the test fail, proving it actually tests something.

## Red-Green-Refactor Cycle

```
RED → Verify Fail → GREEN → Verify Pass → REFACTOR → Repeat
```

### RED: Write Failing Test

Write ONE minimal test showing what should happen.

```typescript
// GOOD: Clear, minimal, one behavior
test('rejects empty email', async () => {
  const result = await validateEmail('');
  expect(result.valid).toBe(false);
  expect(result.error).toBe('Email required');
});

// BAD: Vague name, tests mock
test('validation works', () => {
  const mock = jest.fn().mockReturnValue(true);
  expect(mock()).toBe(true);
});
```

Requirements:
- One behavior per test
- Clear descriptive name
- Test real code, not mocks

### Verify RED: Watch It Fail

**MANDATORY. Never skip.**

```bash
bun run test:run
```

Confirm:
- Test fails (not errors)
- Fails for expected reason (feature missing)
- Failure message makes sense

Test passes immediately? You're testing existing behavior. Fix the test.

### GREEN: Minimal Code

Write simplest code to pass the test. Nothing more.

```typescript
// GOOD: Just enough
function validateEmail(email: string) {
  if (!email?.trim()) {
    return { valid: false, error: 'Email required' };
  }
  return { valid: true };
}

// BAD: Over-engineered
function validateEmail(email: string, options?: {
  allowPlus?: boolean;
  domains?: string[];
  checkMx?: boolean;
}) {
  // YAGNI - You Ain't Gonna Need It
}
```

### Verify GREEN: Watch It Pass

**MANDATORY.**

```bash
bun run test:run
```

Confirm:
- Test passes
- All other tests still pass
- No warnings or errors

### REFACTOR: Clean Up

Only after green:
- Remove duplication
- Improve names
- Extract helpers

Keep tests green throughout. Don't add behavior.

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "Too simple to test" | Simple code breaks. Test takes 30 seconds. |
| "I'll test after" | Tests passing immediately prove nothing. |
| "Already manually tested" | No record, can't re-run, misses edge cases. |
| "Deleting X hours is wasteful" | Sunk cost. Unverified code is debt. |
| "TDD slows me down" | Debugging in prod is slower. |
| "Need to explore first" | Fine. Then delete exploration, start with TDD. |

## Bug Fix Example

**Bug:** Empty array causes crash

```typescript
// 1. RED: Write failing test
test('handles empty array without crashing', () => {
  expect(() => processItems([])).not.toThrow();
  expect(processItems([])).toEqual([]);
});

// 2. Verify fails
// FAIL: TypeError: Cannot read property 'map' of undefined

// 3. GREEN: Minimal fix
function processItems(items: Item[] = []) {
  if (!items.length) return [];
  return items.map(transform);
}

// 4. Verify passes
// PASS

// 5. REFACTOR if needed
```

## Verification Checklist

Before marking complete:

- [ ] Every new function has a test
- [ ] Watched each test fail before implementing
- [ ] Test failed for expected reason
- [ ] Wrote minimal code to pass
- [ ] All tests pass
- [ ] No console errors or warnings

## Red Flags - STOP and Start Over

- Code before test
- Test passes immediately
- Can't explain why test failed
- "I'll add tests later"
- "Just this once"
- Multiple behaviors per test

## Integration with Project

```bash
# Run single test file
bun run test:run src/modules/auth/schemas.test.ts

# Run all tests
bun run test:run

# Watch mode during development
bun test
```

Always run `bun run validate` before committing.
