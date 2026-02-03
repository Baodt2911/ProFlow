# Testing Guide - Vyn Remix Core

Comprehensive guide for writing Unit Tests and running tests for the Vyn Remix Core project.

## 📋 Table of Contents

- [Overview](#overview)
- [Test Directory Structure](#test-directory-structure)
- [Unit Test Guidelines](#unit-test-guidelines)
- [Integration Test Guidelines](#integration-test-guidelines)
- [Mocking Guidelines](#mocking-guidelines)
- [Coverage Requirements](#coverage-requirements)
- [Running Tests](#running-tests)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

---

## 🎯 Overview

The project uses **Vitest** as the testing framework with the following characteristics:
- **Unit Tests**: Test individual functions, classes, services, repositories
- **Integration Tests**: Test actions, loaders, route handlers
- **Coverage**: Minimum 90% coverage requirement for statements and branches
- **Mocking**: Use `vi.fn()` and `vi.mocked()` for mocking

---

## 📁 Test Directory Structure

```
src/app/tests/
├── unit/                    # Unit Tests
│   ├── services/           # Service layer tests
│   │   ├── userService.test.ts
│   │   └── oauthService.test.ts
│   ├── repositories/       # Repository layer tests
│   │   ├── baseRepository.test.ts
│   │   ├── userRepository.test.ts
│   │   └── oauthRepository.test.ts
│   └── utils/              # Utility function tests
│       └── auth.test.ts
├── integration/            # Integration Tests
│   ├── actions/           # Action function tests
│   │   ├── userAction.test.ts
│   │   ├── oauthAction.test.ts
│   │   └── oauthClientAction.test.ts
│   └── loaders/           # Loader function tests
│       ├── userLoader.test.tsx
│       └── oauthLoader.test.tsx
```

---

## 📝 Unit Test Guidelines

### 1. **Test File Structure**

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ServiceFactory } from '~/factories/serviceFactory';

// Mock dependencies
vi.mock('~/factories/serviceFactory');
vi.mock('~/lib/logger');

describe('ServiceName', () => {
  let mockService: any;
  
  beforeEach(() => {
    // Setup mocks
    mockService = {
      method: vi.fn(),
    };
    vi.mocked(ServiceFactory.getService).mockReturnValue(mockService);
  });

  describe('methodName', () => {
    it('should return success when valid input', async () => {
      // Arrange
      const input = { /* test data */ };
      vi.mocked(mockService.method).mockResolvedValue(/* expected result */);
      
      // Act
      const result = await methodUnderTest(input);
      
      // Assert
      expect(result).toEqual(/* expected */);
      expect(mockService.method).toHaveBeenCalledWith(input);
    });

    it('should handle error when service fails', async () => {
      // Arrange
      const error = new Error('Service error');
      vi.mocked(mockService.method).mockRejectedValue(error);
      
      // Act & Assert
      await expect(methodUnderTest(input)).rejects.toThrow('Service error');
    });
  });
});
```

### 2. **Naming Conventions**

- **File name**: `{componentName}.test.ts` or `{componentName}.test.tsx`
- **Describe block**: Name of the class/function being tested
- **Test cases**: Clear description of the behavior being tested
- **Variables**: Use `mock` prefix for mock objects

### 3. **Test Structure (AAA Pattern)**

```typescript
it('should do something when condition', async () => {
  // Arrange - Prepare data and mocks
  const input = { /* test data */ };
  vi.mocked(mockService.method).mockResolvedValue(expectedResult);
  
  // Act - Execute the action being tested
  const result = await methodUnderTest(input);
  
  // Assert - Verify the result
  expect(result).toEqual(expectedResult);
  expect(mockService.method).toHaveBeenCalledWith(input);
});
```

### 4. **Required Test Cases**

Each method should have at least the following test cases:
- ✅ **Happy path**: Valid input, returns correct result
- ❌ **Error handling**: Handles errors from dependencies
- 🔄 **Edge cases**: Input boundaries, null/undefined values
- 🚫 **Validation**: Input validation if applicable

---

## 🔗 Integration Test Guidelines

### 1. **Action Tests**

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createRemixRequest } from '~/tests/utils/testUtils';

// Mock dependencies
vi.mock('~/factories/serviceFactory');
vi.mock('~/lib/logger');

describe('userAction', () => {
  let mockUserService: any;
  
  beforeEach(async () => {
    // Setup mocks
    mockUserService = {
      findOne: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      softDelete: vi.fn(),
    };
    vi.mocked(ServiceFactory.getUserService).mockReturnValue(mockUserService);
  });

  describe('POST /users', () => {
    it('should create user successfully', async () => {
      // Arrange
      const formData = new FormData();
      formData.append('name', 'Test User');
      formData.append('email', 'test@example.com');
      formData.append('password', 'password123');
      
      const request = createRemixRequest('/users', {
        method: 'POST',
        body: formData,
      });
      
      vi.mocked(mockUserService.create).mockResolvedValue({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        // ... other fields
      });
      
      // Act
      const result = await userAction({ request, params: {}, context: {} });
      
      // Assert
      expect(result).toEqual({
        success: true,
        user: expect.objectContaining({
          name: 'Test User',
          email: 'test@example.com',
        }),
      });
    });
  });
});
```

### 2. **Loader Tests**

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createLoaderFunctionArgs } from '~/tests/utils/testUtils';

describe('userLoader', () => {
  let mockUserService: any;
  
  beforeEach(async () => {
    // Setup mocks
    mockUserService = {
      findAndCount: vi.fn(),
    };
    vi.mocked(ServiceFactory.getUserService).mockReturnValue(mockUserService);
  });

  it('should return paginated users', async () => {
    // Arrange
    const loaderArgs = createLoaderFunctionArgs('/users', {
      searchParams: new URLSearchParams('page=1&limit=10'),
    });
    
    vi.mocked(mockUserService.findAndCount).mockResolvedValue({
      status: true,
      data: {
        data: [/* mock users */],
        total: 2,
        page: 1,
        limit: 10,
      },
    });
    
    // Act
    const result = await userLoader(loaderArgs);
    
    // Assert
    expect(result.data).toEqual({
      status: true,
      data: {
        data: expect.arrayContaining([
          expect.objectContaining({ id: expect.any(Number) }),
        ]),
        total: 2,
        page: 1,
        limit: 10,
      },
    });
  });
});
```

---

## 🎭 Mocking Guidelines

### 1. **ServiceFactory Mocking**

```typescript
// ✅ Correct way
vi.mock('~/factories/serviceFactory');

const mockUserService = {
  findOne: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  softDelete: vi.fn(),
};

beforeEach(() => {
  vi.mocked(ServiceFactory.getUserService).mockReturnValue(mockUserService);
});
```

### 2. **Prisma Mocking**

```typescript
// ✅ Correct way
vi.mock('~/lib/prisma');

beforeEach(async () => {
  const { prisma } = await import('~/lib/prisma');
  vi.mocked(prisma.user.findMany).mockResolvedValue([/* mock data */]);
  vi.mocked(prisma.user.create).mockResolvedValue(/* mock data */);
});
```

### 3. **Logger Mocking**

```typescript
// ✅ Correct way
vi.mock('~/lib/logger');

beforeEach(() => {
  const { logger } = require('~/lib/logger');
  vi.mocked(logger.info).mockImplementation(() => {});
  vi.mocked(logger.error).mockImplementation(() => {});
});
```

### 4. **Dynamic Imports for Actions/Loaders**

```typescript
// ✅ Correct way - Avoid hoisting issues
let userAction: any;

beforeEach(async () => {
  const module = await import('~/actions/userAction');
  userAction = module.userAction;
});
```

---

## 📊 Coverage Requirements

### 1. **Minimum Coverage**
- **Statements**: ≥ 80%
- **Branches**: ≥ 80%
- **Functions**: ≥ 80%
- **Lines**: ≥ 80%

### 2. **Coverage Commands**

```bash
# Run tests with coverage
npm run test:coverage

# Run specific test with coverage
npm test -- --run --coverage app/tests/unit/services/userService.test.ts

# Generate coverage report
npm test -- --coverage --reporter=html
```

### 3. **Coverage Configuration**

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'app/models/**/*.ts', // Exclude model files
        '**/*.d.ts',
        '**/*.config.*',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 85,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
});
```

---

## 🚀 Running Tests

### 1. **Run All Tests**

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### 2. **Run Tests by Type**

```bash
# Run only unit tests
npm test -- app/tests/unit/

# Run only integration tests
npm test -- app/tests/integration/

# Run specific test file
npm test -- app/tests/unit/services/userService.test.ts
```

### 3. **Run Tests by Pattern**

```bash
# Run tests matching pattern
npm test -- --run -t "userService"

# Run tests in specific directory
npm test -- --run app/tests/unit/repositories/
```

### 4. **Debug Tests**

```bash
# Run tests with debug output
npm test -- --run --reporter=verbose

# Run single test with debug
npm test -- --run --reporter=verbose app/tests/unit/services/userService.test.ts
```

---

## 🔧 Troubleshooting

### 1. **Hoisting Issues**

**Problem**: `Cannot access 'mockService' before initialization`

**Solution**: Use dynamic imports
```typescript
// ❌ Wrong
const mockService = { method: vi.fn() };
vi.mock('~/factories/serviceFactory', () => ({
  ServiceFactory: { getService: () => mockService }
}));

// ✅ Correct
vi.mock('~/factories/serviceFactory');
let mockService: any;

beforeEach(() => {
  mockService = { method: vi.fn() };
  vi.mocked(ServiceFactory.getService).mockReturnValue(mockService);
});
```

### 2. **Type Errors**

**Problem**: TypeScript errors with mock objects

**Solution**: Use `as any` for test scenarios
```typescript
// ✅ For generic repositories
const result = await repository.updateByConditions(
  { name: "test" } as any,
  { active: true } as any
);
```

### 3. **Date Comparison Issues**

**Problem**: Date objects don't match in assertions

**Solution**: Compare specific fields
```typescript
// ✅ Correct
expect(result.user).toEqual(
  expect.objectContaining({
    name: mockUser.name,
    email: mockUser.email,
    // Don't compare Date objects directly
  })
);
```

### 4. **Mock Reset Issues**

**Problem**: Mocks not resetting between tests

**Solution**: Use `beforeEach` properly
```typescript
beforeEach(() => {
  vi.clearAllMocks();
  // Setup fresh mocks
});
```

---

## 💡 Best Practices

### 1. **Test Organization**

- ✅ Group related tests using `describe` blocks
- ✅ Use descriptive test names
- ✅ Follow AAA pattern (Arrange, Act, Assert)
- ✅ Keep tests independent and isolated

### 2. **Mock Management**

- ✅ Mock at the lowest level possible
- ✅ Use `vi.mocked()` for type safety
- ✅ Reset mocks in `beforeEach`
- ✅ Avoid over-mocking

### 3. **Data Management**

- ✅ Use fixtures for test data
- ✅ Create realistic mock data
- ✅ Avoid hardcoded values in assertions
- ✅ Use `expect.objectContaining()` for partial matches

### 4. **Error Testing**

- ✅ Test both success and error paths
- ✅ Verify error messages and types
- ✅ Test edge cases and boundary conditions
- ✅ Mock external dependencies consistently

### 5. **Performance**

- ✅ Use `--run` flag for CI/CD
- ✅ Use `--watch` for development
- ✅ Group related tests to reduce setup time
- ✅ Avoid unnecessary async operations

---

## 📋 Pre-commit Checklist

- [ ] All tests pass
- [ ] Coverage meets requirements (≥80%)
- [ ] No console.log in tests
- [ ] Mocks are reset properly
- [ ] Test names are descriptive
- [ ] Error cases are fully tested
- [ ] No hardcoded values
- [ ] TypeScript has no errors

---

## 🆘 Support

If you encounter issues with tests:

1. **Check logs**: `npm test -- --reporter=verbose`
2. **Debug hoisting**: Use dynamic imports
3. **Check types**: `npm run typecheck`
4. **Reset mocks**: Ensure `vi.clearAllMocks()` in `beforeEach`
5. **Verify coverage**: `npm run test:coverage`

---

*Happy testing! 🧪* 