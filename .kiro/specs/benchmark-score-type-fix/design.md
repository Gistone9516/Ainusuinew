# Design Document

## Overview

This design addresses a runtime type error in the ModelPage component where benchmark scores from the API are strings but the code expects numbers. The solution involves inline type conversion directly in the component where scores are displayed, without creating new utility functions.

## Architecture

The fix follows a minimal, inline approach:

1. **Type Definition Layer**: Update TypeScript interfaces to accept both string and number types for scores
2. **Component Layer**: Add inline type conversion using `Number()` before calling `.toFixed()` on scores

This approach ensures:
- No runtime errors from type mismatches
- Minimal code changes
- No new functions or utilities needed
- Type safety at compile time

## Components and Interfaces

### 1. Type Definition Updates

**Location**: `src/types/model.ts`

**Changes**:
```typescript
// Update BenchmarkScoreInfo to accept both types
export interface BenchmarkScoreInfo {
  name: string;
  score: string | number;  // Changed from: number
  weight: number;
}

// Update BenchmarkScore to accept both types
export interface BenchmarkScore {
  name: string;
  score: string | number;  // Changed from: number
  weight: number;
  contribution: number;
}
```

### 2. Component Updates

**Location**: `src/components/ModelPage.tsx`

**Changes Required**:
Replace direct `.toFixed()` calls with inline type conversion:

**Before**:
```typescript
{model.benchmark_scores.primary.score.toFixed(1)}
```

**After**:
```typescript
{Number(model.benchmark_scores.primary.score || 0).toFixed(1)}
```

**Affected locations**:
- Line 657: Job recommendations - primary score
- Line 660: Job recommendations - secondary score
- Any other locations where benchmark scores are displayed with `.toFixed()`

**Conversion Logic**:
- `Number(value)` converts strings to numbers
- `|| 0` provides fallback for null/undefined
- `.toFixed(1)` formats to one decimal place

## Data Models

### Input Data Model
```typescript
// API Response (actual)
{
  benchmark_scores: {
    primary: {
      name: string;
      score: string;  // API returns string
      weight: number;
    };
    secondary: {
      name: string;
      score: string;  // API returns string
      weight: number;
    };
  }
}
```

### Internal Data Model
```typescript
// After type definition update
{
  benchmark_scores: {
    primary: {
      name: string;
      score: string | number;  // Accepts both
      weight: number;
    };
    secondary: {
      name: string;
      score: string | number;  // Accepts both
      weight: number;
    };
  }
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property Reflection

Before defining properties, let's identify any redundancy:

- Properties 1.1, 1.4, and 1.5 all test that the inline conversion handles string and number types correctly. Since we're using the same inline pattern everywhere, we only need one property.
- Properties 2.1 and 2.2 test the same conversion logic - they can be combined.
- Property 1.3 is subsumed by the general formatting property.

After reflection, we'll consolidate to avoid redundancy.

### Correctness Properties

Property 1: Inline type conversion handles all numeric inputs
*For any* valid numeric value (whether provided as a string or number), the expression `Number(value || 0).toFixed(1)` should return a string formatted to one decimal place
**Validates: Requirements 1.1, 1.4, 1.5, 2.1, 2.2**

Property 2: Null and undefined fallback
*For any* null or undefined value, the expression `Number(value || 0).toFixed(1)` should return "0.0"
**Validates: Requirements 1.2, 2.3**

Property 3: Invalid input handling
*For any* invalid input value (non-numeric strings), the expression `Number(value || 0).toFixed(1)` should return "NaN" or "0.0" depending on the value
**Validates: Requirements 2.4**

## Error Handling

### Input Validation Errors

**Scenario**: Invalid score values from API
- **Detection**: Check for NaN after parseFloat
- **Handling**: Return "0.0" as fallback
- **User Impact**: Displays zero instead of crashing

**Scenario**: Null or undefined scores
- **Detection**: Explicit null/undefined check
- **Handling**: Return "0.0" as fallback
- **User Impact**: Displays zero instead of crashing

### Type Errors

**Scenario**: Unexpected data types (objects, arrays)
- **Detection**: Type coercion will produce NaN
- **Handling**: NaN check returns "0.0"
- **User Impact**: Displays zero instead of crashing

### Edge Cases

1. **Empty string**: Treated as invalid, returns "0.0"
2. **Whitespace-only string**: Treated as invalid, returns "0.0"
3. **Scientific notation**: Handled correctly by parseFloat
4. **Negative numbers**: Formatted correctly with negative sign
5. **Very large numbers**: Formatted correctly (may use scientific notation if too large)
6. **Very small numbers**: Formatted correctly (may round to 0.0)

## Testing Strategy

### Unit Testing

We will write unit tests for the inline conversion pattern `Number(value || 0).toFixed(1)` covering:

1. **Valid string inputs**: "85.5", "100", "0", "42.123456"
2. **Valid number inputs**: 85.5, 100, 0, 42.123456
3. **Edge cases**: null, undefined, "", "   ", "abc", NaN
4. **Negative numbers**: -10.5, "-10.5"

### Property-Based Testing

We will use **fast-check** (JavaScript/TypeScript property-based testing library) to verify universal properties:

1. **Property 1 Test**: Generate random valid numeric values (both strings and numbers), apply the conversion, verify all outputs match the regex pattern `^-?\d+\.\d{1}$`

2. **Property 2 Test**: Generate null and undefined values, verify all return "0.0"

3. **Property 3 Test**: Generate random invalid string inputs, verify they either return "NaN" or "0.0"

Each property test should run a minimum of 100 iterations to ensure comprehensive coverage.

### Manual Testing

1. Load the ModelPage in the browser
2. Trigger job recommendations
3. Trigger task search recommendations  
4. Verify all scores display without errors
5. Check browser console for any warnings or errors
